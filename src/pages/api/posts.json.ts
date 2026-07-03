import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((post) => ({
      slug: post.id,
      url: `/posts/${post.id}/`,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date.toISOString(),
      updated: post.data.updated?.toISOString() ?? null,
      tags: post.data.tags,
      category: post.data.category,
    }));

  return new Response(JSON.stringify(posts, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
