# Routemate

<img src="assets/brand/routemate-logo.svg" alt="Routemate logo" width="300" />

# Wanna be my routemate?

Routemate is a carpooling prototype for university students, starting at York University’s Keele campus. It uses fictional students and simulates ride requests. It runs in the browser without a backend.

[Judge demo on GitHub Pages](https://zxcpivo.github.io/routemate/)

## Launch locally

Use Node.js 24 and npm. Run these commands from the repository root.

```bash
cd frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) or use the URL Vite prints in the terminal. Click **Get started**. Press `Ctrl+C` in the terminal to stop the server.

## Test the prototype

Between runs, click **Restart demo** in the presenter panel. On mobile, open the panel with **Demo controls**. On **Create your account**, select a fictional student record in the presenter panel, click **Fill in demo details**, then **Verify and create account**.

| Flow | Steps | What to check |
| --- | --- | --- |
| Driver | Choose **I drive** and keep the defaults for York Keele, Downtown Brampton, and 8:00 AM on weekdays. | Your savings estimates 6 extra minutes and about $78 per month with three riders. Pick a few interests and check the match cards for topics you share. Continue through the shared route to **Route shared!** |
| Rider | Choose **I need a ride** and keep the defaults for York Keele, Malton, and 8:00 AM on Monday, Wednesday, and Thursday. | Nine drivers appear. The suggested ride costs $3 and saves about 19 minutes. Continue through the shared route to **Request accepted!** |
| Any trip | Pick any start, destination, time and days. | The demo fits its fictional students to the entered trip. Ride preferences still apply. **Preview: no riders found** in the presenter controls on Your savings shows the no-match screen, which offers to change the starting point or arrival time. As a driver it also lists earlier arrival times that have riders; tapping one returns to Your savings with that time. **Preview: nobody selected** in the presenter controls on Shared route shows that screen. |
| Ride preferences | Verify the sample record marked **Woman listed**, then try **At least one other woman** and **Women only**. | Women-only excludes other profiles. On a driver route, each shared day must have a woman passenger when **At least one other woman** is active. Backups follow the preference too. |
| Route management | From Home, add a route for another class day or choose **Add return route** from **View all routes**. Change the days and arrival time, save, then edit one route. | Both routes keep separate schedules and matches after reload. Home shows the next trip across both. **Can’t drive?** asks for a route before showing dates. |

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
