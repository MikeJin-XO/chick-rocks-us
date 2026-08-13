# Chick Rocks — Project Guide

Marketing site for Chick Rocks (halal fried chicken, Queens NY). React/Vite SPA that
is **built into a WordPress theme** and deployed to SiteGround.

## Stack
- Vite + React 18 + TypeScript, Tailwind + shadcn/ui (`vite_react_shadcn_ts`).
- Routing: `react-router-dom` (`BrowserRouter`), routes defined in `src/App.tsx`
  (`/`, `/menu`, `/catering`, `/blog`, `/blog/:slug`, `/about`, `/faq`, `/privacy`, `/terms`).
- Data fetching: `@tanstack/react-query`.
- **Package manager: pnpm** (migrated from npm — see Build gotcha below).
- Pages live in `src/pages/`, shared UI in `src/components/`.

## Commands
- `pnpm dev` — local dev server (vite).
- `pnpm build` — production SPA build to `dist/`.
- `pnpm build:wordpress` (`node build-wp-theme.js`) — build the SPA and assemble the
  `chick-rocks` WordPress theme into `wordpress-theme/` (+ uploadable zip).
- `pnpm lint`, `pnpm test` (vitest).

## Deployment — IMPORTANT
**Live site = WordPress on SiteGround at https://chickrocksus.com.** It is NOT the
GitHub Pages `deploy.yml` workflow (that targets a `/chick-rocks-2/` preview only).

Deploy via the repo `Makefile` (SiteGround SSH/rsync creds are baked in):
- `make prod` = `build` + `backup` (tars the live theme into `~/backups/` on the server)
  + `deploy` (rsync `wordpress-theme/` → theme dir, **no `--delete`**).
- `make backup` / `make deploy` / `make deploy-clean` / `make ssh` / `make purge-cache`.
- Always `make purge-cache` after deploy (`wp sg purge` + `wp cache flush`), and the
  homepage HTML should reference the freshly-hashed `assets/index-*.js`.

### Content is WordPress post meta, and meta OVERRIDES code defaults
Editable text/images use `InlineEdit` / `MediaEdit` + `EditContext` (`getDraftValue(key, default)`).
The default passed in code is only a **fallback** — if a value was edited on the live
site it is saved to **WP post meta**, which takes precedence. Deploying new code/defaults
does **not** change existing meta.

So to change a value that has already been edited on live, you must edit the meta on the
server, e.g. (home page is post ID 14):
```
make ssh   # then, in ~/www/chickrocksus.com/public_html:
wp post meta get 14 hero_slide_1_img
wp post meta delete 14 hero_slide_1_img   # falls back to the theme default
```
Hero slides are driven by `hero_slide_1_img` / `_2_img` / `_3_img` on the home page
(see `src/components/HeroSection.tsx`). Treat production `wp post meta` writes as
outward-facing DB changes — confirm before running, and note old values for rollback.

### Deploying only ONE page's change (excluding other WIP)
The app is a single SPA bundle, so a build ships the whole working tree. To ship one
change without other uncommitted WIP: `git stash push` every modified file except the
target, build from that isolated tree, deploy, then `git stash pop`. Verify the
exclusion by grepping `wordpress-theme/assets/*.js` for a unique string from the
held-back work (expect 0 matches).

## Build gotcha (pnpm)
After the npm→pnpm migration, `pnpm build` / `make build` can FAIL with:
`Rollup failed to resolve import "@tanstack/query-core"`. Cause: `resolve.dedupe` in
`vite.config.ts` lists `@tanstack/query-core`, forcing root-level resolution, but pnpm's
strict layout only hoists it nested (flat npm installs used to hoist it to root). This
also breaks the GitHub Actions deploy (`npm ci`).

**Permanent fix (not yet applied):** add a `.npmrc` with
`public-hoist-pattern[]=@tanstack/query-core` (or `shamefully-hoist=true`) and reinstall,
OR remove `@tanstack/query-core` from the `dedupe` array in `vite.config.ts`.
Quick unblock without config change:
`ln -sf ../.pnpm/@tanstack+query-core@<ver>/node_modules/@tanstack/query-core node_modules/@tanstack/query-core`
(this symlink is wiped on the next `pnpm install`).
