# Personal Website

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

My personal website built with [Astro](https://astro.build/) and deployed on Cloudflare Workers. The design is based on the [astro-theme-terminal](https://github.com/dennisklappe/astro-theme-terminal) theme by Dennis Klappe, providing a clean, terminal-inspired aesthetic.

**Live Site:** [winsten.dev](https://winsten.dev)

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v5
- **Language:** TypeScript
- **Styling:** Custom CSS
- **Deployment:** Cloudflare Workers
- **Build Tool:** Wrangler

## Project Structure

```
personal-website/
├── src/
│   ├── layouts/          # Reusable layout components
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Page routes and content
│   │   ├── projects/     # Project showcase pages
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── research.astro
│   │   └── 404.astro
│   └── styles/           # CSS stylesheets
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

## Deployment

This site is deployed on Cloudflare Workers using Wrangler.

### Deploy to Cloudflare

```bash
# Check deployment (dry run)
npm run check

# Deploy to production
npm run deploy
```

### Configuration

- `wrangler.json` - Cloudflare Workers configuration
- `astro.config.mjs` - Astro build and integration settings

## License

This project is licensed under the MIT License.

## Author

**Jesper Winsten**

- Website: [winsten.dev](https://winsten.dev)
- GitHub: [@ItsWinsten](https://github.com/ItsWinsten)

---

Built with ❤️ using Astro
