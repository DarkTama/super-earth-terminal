# 2. Vite Build Pipeline and GitHub Actions Pages Deployment

## Status
Accepted

## Context
The user requested a project architecture aligned with their existing production app (`BagiAdil` - https://github.com/DarkTama/BagiAdil). The project targets free GitHub Pages hosting, requires modern asset bundling, CSS modularity, and automated CI/CD deployment on pushes to `main`.

## Decision
1. Scaffold project with Vite (`vite`, `npm run dev`, `npm run build`, `npm run preview`).
2. Configure `base: './'` in `vite.config.js` to ensure portable relative asset paths across local dev, preview, and GitHub Pages subpaths.
3. Provide `.github/workflows/deploy.yml` implementing standard `actions/upload-pages-artifact@v3` (targeting `dist`) and `actions/deploy-pages@v4`.
4. Keep the core runtime lightweight: zero heavy UI frameworks (React/Vue/Angular), modern ES modules with structured CSS and Web Audio API synthesis.

## Consequences
- Matches the user's familiar tooling from `BagiAdil`.
- Automated zero-config deployment to GitHub Pages via Git push.
- Clean development server with Hot Module Replacement (HMR) for rapid UI iteration.
