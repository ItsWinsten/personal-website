# Personal Website

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is the source for [winsten.dev](https://winsten.dev), my personal website. It is built with [Astro](https://astro.build/), hosted on Cloudflare Pages, and based on Dennis Klappe's [astro-theme-terminal](https://github.com/dennisklappe/astro-theme-terminal).

**Live Site:** [winsten.dev](https://winsten.dev)

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v7
- **Language:** TypeScript
- **Styling:** Custom CSS
- **Deployment:** Cloudflare Pages
- **Local preview:** Wrangler

## Project Structure

```
personal-website/
├── src/
│   ├── layouts/          # Reusable layout components
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Page routes and content
│   │   ├── projects/     # Project pages
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── research.astro
│   │   ├── teaching.astro
│   │   └── 404.astro
│   └── styles/           # CSS stylesheets
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

## Deployment

Cloudflare Pages builds and deploys the site from the `main` branch through its GitHub integration.

### Local verification

```bash
# Build the site and check its TypeScript
npm run check

# Run the generated Pages output locally
npm run preview
```

The Cloudflare Pages build command is `npm run build`, and its output directory is `dist/client`.

## License

This project is licensed under the MIT License.

## Author

**Jesper Winsten**

- Website: [winsten.dev](https://winsten.dev)
- GitHub: [@ItsWinsten](https://github.com/ItsWinsten)

---

Built with Astro.
