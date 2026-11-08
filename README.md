# Routemate

<img src="assets/brand/routemate-logo.svg" alt="Routemate logo" width="300" />

# Wanna be my routemate?

Routemate is a clickable carpooling prototype with simulated drivers, riders, and ride requests. It runs in the browser without a backend.

[Judge demo on GitHub Pages](https://zxcpivo.github.io/unhack-shenanigans/) · [Update Routemate with an LLM](AGENTS.md)

## Launch locally

Use Node.js 24 and npm. Run these commands from the repository root.

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) or use the URL Vite prints in the terminal. Click **Start the demo**. Press `Ctrl+C` in the terminal to stop the server.

## Test the prototype

Between runs, click **Restart demo** in the desktop side panel or **Restart the demo** on the final screen. When the demo asks for an account, click **Fill in demo details**, then **Create account**.

| Flow | Steps | What to check |
| --- | --- | --- |
| Driver | Choose **I drive** and keep the defaults for York Keele, Downtown Brampton, and 8:00 AM on weekdays. | Eight riders appear. The three suggested riders add 6 minutes and save about $78 per month. Continue through the shared route to **Route shared!** |
| Rider | Choose **I need a ride** and keep the defaults for York Keele, Malton, and 8:00 AM on Monday, Wednesday, and Thursday. | Nine drivers appear. The suggested ride costs $3 and saves about 19 minutes. Continue through the shared route to **Request accepted!** |
| Any trip | Pick any start, destination, time and days. | Matches always appear. **Preview: no riders found** on Your savings shows the no-match screen, which offers to change the starting point or arrival time. **Preview: nobody selected** on Shared route shows that screen. |

From `frontend/`, run `npm run lint` and `npm run build` to check the code. After building, `npm run preview` serves the production build locally, usually at [http://localhost:4173](http://localhost:4173).

## Update the GitHub Pages demo

A repository maintainer enables **GitHub Actions** as the source under **Settings → Pages**. The [Pages workflow](.github/workflows/pages.yml) builds and publishes the frontend on pushes to `main` and `codex/judge-preview`. [GitHub Pages setup guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

To check the Pages build locally, run these commands from `frontend/` with Node.js 24.

```bash
npm ci
npm run build:pages
npm run preview
```

After pushing, check the [deployment workflow run](https://github.com/zxcpivo/unhack-shenanigans/actions/workflows/pages.yml), then open the judge link and [the rider setup deep link](https://zxcpivo.github.io/unhack-shenanigans/#/setup/rider) in a browser.

See the [frontend guide](frontend/README.md) for the full demo walkthrough and how matching works.
