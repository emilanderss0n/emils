import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import fs from "node:fs";
import path from "node:path";

// Portfolio posts (local Markdown, Content Layer glob loader)
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default("other"),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// GitHub repos (external API, loaded at build time)
const GITHUB_USER = "emilanderss0n";

function shouldIncludeRepo(repo: any): boolean {
  if (repo.name === repo.owner?.login) return false;
  if (repo.fork) return false;
  if (repo.archived) return false;
  return true;
}

function detectCategory(topics: string[], language: string): string {
  const lowered = (t: string) => t.toLowerCase();
  if (topics.some((t) => ["game-mod", "game-development"].includes(lowered(t)))) return "game-development";
  if (topics.some((t) => ["website"].includes(lowered(t)))) return "web-development";
  if (["c#", "c++", "lua"].includes(language)) return "game-development";
  if (["typescript", "javascript", "css", "html", "php"].includes(language)) return "web-development";
  return "other";
}

interface ReleaseStats {
  releases: number;
  downloads: number;
}

/** How many releases a repo has, and how often their files have been downloaded. */
async function fetchReleaseStats(fullName: string, headers: Record<string, string>): Promise<ReleaseStats> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/releases?per_page=100`, { headers });
  if (!res.ok) throw new Error(`releases ${res.status}`);
  const releases = (await res.json()) as any[];
  const downloads = releases.reduce(
    (sum, release) => sum + release.assets.reduce((total: number, asset: any) => total + asset.download_count, 0),
    0
  );
  return { releases: releases.length, downloads };
}

function mapRepo(repo: any, stats: ReleaseStats) {
  const topics = (repo.topics ?? []) as string[];
  const lang = (repo.language ?? "").toLowerCase();
  return {
    id: repo.id.toString(),
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    stars: repo.stargazers_count,
    language: repo.language ?? "N/A",
    topics,
    category: detectCategory(topics, lang),
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    ...stats,
  };
}

type RepoEntry = ReturnType<typeof mapRepo>;

// The last successful fetch, kept in Astro's cache folder. If GitHub can't be reached,
// the build reuses it instead of shipping an empty project list.
const cacheFile = path.resolve("node_modules/.astro/github-repos.json");

function readCache(): RepoEntry[] | null {
  try {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch {
    return null;
  }
}

function writeCache(entries: RepoEntry[]) {
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(entries));
}

const repos = defineCollection({
  loader: async () => {
    const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) headers["Authorization"] = "Bearer " + token;

    const cached = readCache();
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`,
      { headers }
    ).catch(() => null);

    if (!res?.ok) {
      const reason = res ? res.status : "network error";
      if (cached) {
        console.warn(`[github] ${reason} — using the cached repo list`);
        return cached;
      }
      console.warn(`[github] ${reason} — falling back to empty repo list`);
      return [];
    }

    const data = (await res.json()) as any[];
    const previous = new Map(cached?.map((entry) => [entry.id, entry]));
    const entries = await Promise.all(
      data.filter(shouldIncludeRepo).map(async (repo) => {
        const stats = await fetchReleaseStats(repo.full_name, headers).catch((err) => {
          // Keep the last known numbers rather than dropping this repo's downloads.
          const last = previous.get(String(repo.id));
          console.warn(`[github] ${repo.name}: ${err.message}, using the cached release stats`);
          return { releases: last?.releases ?? 0, downloads: last?.downloads ?? 0 };
        });
        return mapRepo(repo, stats);
      })
    );
    writeCache(entries);
    return entries;
  },
  schema: z.object({
    name: z.string(),
    fullName: z.string(),
    description: z.string().nullable(),
    url: z.string().url(),
    homepage: z.string().nullable(),
    stars: z.number(),
    language: z.string(),
    topics: z.array(z.string()),
    category: z.string().optional().default("other"),
    pushedAt: z.string(),
    createdAt: z.string(),
    releases: z.number(),
    downloads: z.number(),
  }),
});

export const collections = { posts, repos };