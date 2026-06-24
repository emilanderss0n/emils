---
title: "Building a Portfolio with Astro 5"
description: "How I built this portfolio site using Astro 5, Tailwind CSS, and the Content Layer — all deployed to shared hosting."
date: 2026-06-20
tags: ["astro", "webdev", "portfolio"]
category: web-development
image: "/projects/astro-portfolio.jpg"
---

Astro 5 introduces the **Content Layer**, a new way to manage content that gives you a unified, type-safe API — whether your content lives in Markdown files, a CMS, or an external API.

## Why Astro for a Portfolio?

For a portfolio hosted on shared hosting, Astro's static output is perfect. You get:

- **Zero JavaScript by default** — pages are pure HTML/CSS
- **Build-time data fetching** — pull from GitHub, RSS feeds, any API
- **Content collections** — type-safe Markdown with frontmatter validation
- **View Transitions** — SPA-like navigation without a framework

## The Content Layer

The new Content Layer in Astro 5 lets you define collections with Zod schemas. Here's what my `config.ts` looks like:

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
```

Now I can query posts with full type safety using `getCollection('posts')`.

## What's Next

I plan to add more posts about:

- Game dev with Unity and Blender
- Web design patterns I've used
- Tools and workflows that make me productive
