# Pretiola — Agent Guide

## What This Is

A Rust/Actix-web charity website for the Sr. Dolores Foundation. The server renders Tera HTML templates and serves static assets. Styling is Tailwind CSS v4. Images are optimized at build time via a Node.js Sharp script. Deployed to Fly.io via multi-stage Docker build.

## Key Conventions

- **Adding a page:** Create `templates/{slug}.html`. It's automatically routable at `/{slug}.html` and appears in the sitemap. No Rust code changes needed.
- **Partials:** `navbar.html` and `footer.html` are `{% include %}`d by all pages. They are excluded from the sitemap via the `PARTIALS` array in `src/routes.rs`.
- **Template context:** Every page gets `page_name` (string) and `current_year` (integer).
- **Main container pattern:** All pages use `<main class="container mx-auto px-0 md:px-4 py-8 max-w-4xl">`. Headings add `px-4 md:px-0` for mobile padding.
- **Images:** Use `<picture>` with WebP + JPEG `<source>` elements pointing to `/pictures/optimized/{name}_{size}w.{webp,jpg}`. Always provide a JPEG `<img>` fallback.
- **Package name:** `pretiola` (not "petriola" — this was a historical typo, now fixed).

## File Map

| Path | Purpose |
|---|---|
| `src/main.rs` | Entry point. Reads `PORT` env var, default `8080`. |
| `src/startup.rs` | Actix-web app config: Tera init, routes, static files. |
| `src/routes.rs` | `index`, `dynamic_page`, `sitemap` handlers. `render_page()` is the shared renderer. |
| `src/lib.rs` | Exports `routes` and `startup` modules. |
| `templates/*.html` | 9 pages + 2 partials. |
| `static/css/styles.css` | Tailwind v4 source (input). |
| `static/css/tailwind.css` | Compiled CSS (built by `npm run build:css`). |
| `static/pictures/` | Source images. |
| `static/pictures/optimized/` | Generated variants (gitignored). Built by `npm run build:images`. |
| `scripts/optimize-images.js` | Image pipeline: Sharp, 3 sizes, WebP + JPEG. |
| `tests/health_check.rs` | Integration tests against a real server instance. |
| `Dockerfile` | Multi-stage: `builder` (Rust), `asset-builder` (Node/CSS/images), runtime (Debian slim). |
| `fly.toml` | Fly.io config. App: `srdolores-foundation-it`, region: `yyz`, port: `8080`. |

## Build Commands

```sh
npm run build:css       # Tailwind source → static/css/tailwind.css
npm run build:images    # Source images → static/pictures/optimized/
cargo build             # Compile Rust server
cargo test              # Run integration tests (spawns real server on random port)
```

## Things to Watch Out For

- `static/pictures/optimized/` is gitignored. Run `npm run build:images` locally before testing image rendering.
- The Dockerfile builds CSS and images in the `asset-builder` stage — changes to `scripts/` or `static/css/styles.css` are picked up automatically on deploy.
- Tests spawn a real Actix-web server on a random port. They require `templates/` and `static/` to be present in the working directory.
- The sitemap is generated dynamically from Tera's template list. No need to update it manually when adding pages.
