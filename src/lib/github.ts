// Which GitHub repos show up under "More projects". Everything public that
// isn't a fork, archived, featured or hidden is listed automatically.
// Repos are matched by their GitHub ID, so renaming a repo doesn't change where it shows up.
// Find an ID with: curl https://api.github.com/repos/emilanderss0n/<name> (the "id" field).
import { getCollection } from 'astro:content';

export const githubProfile = 'https://github.com/emilanderss0n';

/** Repos that already have a featured row above the list. */
export const featured = {
  nhlplay: '1066127097', // nhlplay-feedback
  tarkynator: '893597914', // tarkynator
  menuOverhaul: '870966768', // SPT-Menu-Overhaul
};

/** Minor or inactive repos kept off the site. */
const hidden = [
  '948811395', // emils
  '522706603', // dashxe-vscode-theme
  '808370196', // Actual-Sick-SICC
  '1027828458', // moxopixel
  '808642854', // BlackCore
  '831855542', // WhiteCore
  '831857514', // GreenCore
  '830452969', // SandCore
  '808639911', // MagTape
  '828062261', // TMS
  '1247871000', // spt-hideout-shootout
  '805177682', // WarHeads
];

/** All public repos, used for the repo count. */
export const getRepos = () => getCollection('repos');

/** Repos for the "More projects" list, most recently updated first. */
export async function getMoreRepos() {
  const repos = await getRepos();
  return repos
    .filter((repo) => !Object.values(featured).includes(repo.id) && !hidden.includes(repo.id))
    .sort((a, b) => Date.parse(b.data.pushedAt) - Date.parse(a.data.pushedAt));
}

/** A repo's current GitHub page, for the featured rows. */
export async function getRepoInfo(id: string) {
  const repo = (await getRepos()).find((entry) => entry.id === id);
  return { url: repo?.data.url };
}

/** Totals across all public repos, for the stats on the home page. */
export async function getGithubStats() {
  const repos = await getRepos();
  return {
    repos: repos.length,
    releases: repos.reduce((sum, repo) => sum + repo.data.releases, 0),
    downloads: repos.reduce((sum, repo) => sum + repo.data.downloads, 0),
  };
}
