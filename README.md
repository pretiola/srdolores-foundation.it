# Pretiola

A lightweight Rust web framework for the **Sr. Dolores Foundation** charity website ([srdolores-foundation.it](https://srdolores-foundation.it)). Built on Actix-web with Tera templates and Tailwind CSS, deployed to Fly.io via Docker.

## Architecture

```
Request → Actix-web server (port 8080)
            ├── /                  → index handler (Tera render)
            ├── /{page}.html       → dynamic_page handler (Tera render)
            ├── /sitemap.xml       → auto-generated from template list
            ├── /static/**         → static file serving
            ├── /pictures/**       → alias for /static/pictures
            └── /**                → fallback static serving (robots.txt, etc.)
```

The entire Rust backend is three files:

| File | Role |
|---|---|
| `src/main.rs` | Entry point. Reads `PORT` env var (default `8080`), binds listener. |
| `src/startup.rs` | Configures Actix-web app: Tera init, route registration, static file serving. |
| `src/routes.rs` | Three handlers: `index`, `dynamic_page`, `sitemap`. All template rendering goes through `render_page()`. |

**Convention:** To add a new page, create `templates/my_page.html` — it's automatically routable at `/my_page.html` and included in the sitemap. Partials (navbar, footer) are excluded from the sitemap via the `PARTIALS` constant.

## Project Structure

```
├── src/                  # Rust source (3 files)
├── templates/            # Tera HTML templates (9 pages + 2 partials)
├── static/
│   ├── css/              # Tailwind source + compiled output
│   └── pictures/         # Source images + optimized/ (generated, gitignored)
├── scripts/
│   └── optimize-images.js  # Sharp-based image pipeline (WebP + JPEG, 3 sizes)
├── tests/                # Integration tests (health check, all pages, sitemap, 404, HEAD)
├── Dockerfile            # Multi-stage: Rust builder + Node asset-builder + Debian runtime
├── fly.toml              # Fly.io deployment config (yyz region)
└── docker-compose.yml
```

## Development

**Prerequisites:** Rust toolchain, Node.js 20+

```sh
# Install Node dependencies (Tailwind CLI, Sharp)
npm install

# Build CSS
npm run build:css

# Build optimized images (WebP + JPEG at 400w/800w/1200w)
npm run build:images

# Run the server
cargo run
# → http://localhost:8080

# Run tests
cargo test
```

## Deployment

Deployed to Fly.io. The Dockerfile handles everything:

1. **builder** stage — compiles the Rust binary (with dependency caching)
2. **asset-builder** stage — runs `npm run build:css` and `npm run build:images`
3. **runtime** stage — Debian slim with just the binary, templates, and static assets

```sh
fly deploy
```

## Templates

All pages use Tera's `{% include %}` for `navbar.html` and `footer.html`. Templates receive two context variables:

- `page_name` — the page slug (e.g., `"index"`, `"who_we_are"`)
- `current_year` — for copyright footers

## Image Pipeline

`scripts/optimize-images.js` processes all images in `static/pictures/`:

- Generates 400w, 800w, 1200w variants in both WebP and JPEG
- Prefers `*_sharpen.{png,jpg}` as high-res source when available
- Output goes to `static/pictures/optimized/` (gitignored, built in Docker)
- Templates use `<picture>` with `srcset` for responsive serving
