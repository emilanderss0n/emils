# emilandersson.com

The source of my portfolio site, built with [Astro](https://astro.build) 7, plain CSS and a little TypeScript.

## Run it

Needs Node 22.14 or later. Astro stays on 7.3 because 7.4 needs Node 22.23.4.

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # writes the site to dist/
```

The build reads my public GitHub repos for the stats and the More projects list. A `GITHUB_TOKEN` in `.env` raises GitHub's rate limit, but the build also works without one, and falls back to the last saved copy if GitHub can't be reached.

## Hosting

`dist/` is committed. The server serves the repo root, and `.htaccess` quietly rewrites every request into `dist/`.

Third-party code and its licenses are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
