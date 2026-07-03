import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');

// Map each post id → the data used to render its social image.
// A site-wide "default" image is used as the fallback OG image.
const pages: Record<string, { title: string; description: string }> = {
  default: {
    title: 'Emil / Moxo',
    description:
      'Full-stack developer building tools, game mods, web experiences, and creating music.',
  },
  ...Object.fromEntries(
    posts
      .filter((p) => !p.data.draft)
      .map((post) => [post.id, post.data]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_id, page: { title: string; description: string }) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './src/assets/logo-2x.png',
      size: [80],
    },
    bgGradient: [
      [10, 12, 20],
      [22, 26, 42],
    ],
    border: { color: [99, 102, 241], width: 8, side: 'inline-start' },
    padding: 70,
    font: {
      title: {
        color: [244, 244, 245],
        size: 62,
        weight: 'SemiBold',
        lineHeight: 1.1,
      },
      description: {
        color: [161, 161, 170],
        size: 30,
        weight: 'Normal',
        lineHeight: 1.4,
      },
    },
    fonts: [
      'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/inter/latin-600-normal.ttf',
    ],
  }),
});
