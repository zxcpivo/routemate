# Routemate

<img src="assets/brand/routemate-logo.svg" alt="Routemate logo" width="300" />

Routemate is a carpooling prototype for university students, starting at York University’s Keele campus. Plan recurring trips, find compatible drivers or riders, and agree on a shared route and cost.

[Open the demo](https://zxcpivo.github.io/routemate/)

The app includes driver and rider onboarding, trip maps, ride preferences, multiple saved routes, backup drivers, arrival check-in, and light and dark themes. It runs in the browser with fictional students and simulated accounts and ride requests. Travel times and costs are estimates.

## Launch locally

Use Node.js 24 and npm. Run these commands from the repository root.

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), or the URL Vite prints, and click **Get started**. Press `Ctrl+C` to stop the server.

## Development

Run these commands from `frontend/`:

```bash
npm run lint         # Code checks
npm run build        # TypeScript check and production build
npm run build:pages  # GitHub Pages build with hash routes and relative assets
npm run preview      # Serve the last build locally
```

## Repository guide

| Path | Contents |
| --- | --- |
| `frontend/src/demo/` | Guided demo, route planning, and dashboard |
| `frontend/src/pages/` | Full app: setup, matches, match details, and My ride |
| `frontend/src/lib/` | Matching, preferences, saved state, and shared types |
| `frontend/src/components/`, `frontend/src/styles/` | Shared controls and styling |
| `assets/brand/` | SVG logo and icon |
| `.github/workflows/pages.yml` | GitHub Pages deployment |

- [Development guide](docs/development.md): smoke tests, saved data, and deployment.
- [Demo flow](docs/demo-flow.md): screens and navigation for both app flows.
- [Design system](frontend/DESIGN_SYSTEM.md): tokens, components, and accessibility.
- [Product decisions](docs/product.md) and [research notes](docs/research.md): agreed scope and interview evidence.
- [Contributor instructions](AGENTS.md): source map and behaviour to preserve.
