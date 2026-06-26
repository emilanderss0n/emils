import { defineCollection, z } from "astro:content";

// Portfolio posts (local Markdown)
const posts = defineCollection({
  type: "content",
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

function mapRepo(repo: any) {
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
  };
}

const repos = defineCollection({
  loader: async () => {
    const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) headers["Authorization"] = "Bearer " + token;

    const res = await fetch(
      "https://api.github.com/users/emilanderss0n/repos?sort=updated&per_page=100&type=owner",
      { headers }
    );

    if (!res.ok) {
      console.warn("[github] " + res.status + " \u2014 falling back to empty repo list");
      return [];
    }

    const data = (await res.json()) as any[];
    return data.filter(shouldIncludeRepo).map(mapRepo);
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
  }),
});

export const collections = { posts, repos };