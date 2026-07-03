import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const repos = (await getCollection('repos'))
    .sort((a, b) => b.data.stars - a.data.stars)
    .map((repo) => repo.data);

  return new Response(JSON.stringify(repos, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
