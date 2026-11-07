# Routemate

<img src="assets/brand/routemate-logo.svg" alt="Routemate logo" width="300" />

# Wanna be my routemate?

Routemate is a clickable carpooling prototype with simulated drivers, riders, and ride requests. It runs in the browser without a backend.

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
| Driver | Choose **I drive** and keep the defaults for York Keele, Downtown Brampton, and 9:00 AM on weekdays. | Five riders appear. The three suggested riders add 9 minutes and save about $78 per month. Continue through the shared route to **Route shared!** |
| Rider | Choose **I need a ride** and keep the defaults for York Keele, Malton, and 8:45 AM on Monday, Wednesday, and Thursday. | Three drivers appear. The suggested ride costs $2.50 and saves about 19 minutes. Continue through the shared route to **Request accepted!** |
| No match | Choose **Maple** as the starting point and keep the default schedule. | The demo offers to change the starting point or arrival time. |

From `frontend/`, run `npm run lint` and `npm run build` to check the code. After building, `npm run preview` serves the production build locally, usually at [http://localhost:4173](http://localhost:4173).

## Test from GitHub

### GitHub Codespaces

1. [Open the judge preview branch in Codespaces](https://codespaces.new/zxcpivo/unhack-shenanigans/tree/codex/judge-preview). The Codespace installs dependencies, builds the prototype, and starts the preview on port `5173`.
2. Open **Routemate judge demo** from the **Ports** tab. If the preview fails to open, check `/tmp/routemate-preview.log` in the Codespaces terminal.
3. To share the demo, set **Port Visibility → Public** on port `5173` and copy its forwarded URL. Anyone with the URL can open the demo while the Codespace is running. Keep it active during judging and set the port back to **Public** if you restart the Codespace. [GitHub port forwarding guide](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace)

Send judges the forwarded demo URL. The Codespaces creation link is for repository collaborators hosting the demo.

### GitHub Pages

For a shareable demo link that opens without a terminal, deploy the static `frontend/dist` build to GitHub Pages with GitHub Actions. A project site under `/unhack-shenanigans/` needs a matching Vite base path and React Router basename. Direct links to screens such as `/setup/rider` also need a routing strategy that works on a static host. [Vite deployment guide](https://vite.dev/guide/static-deploy#github-pages)

See the [frontend guide](frontend/README.md) for the full demo walkthrough and how matching works.
