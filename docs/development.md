# Development guide

## Run and build

Use Node.js 24 and npm. From the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Vite normally serves the app at [http://localhost:5173](http://localhost:5173). The root opens the guided demo. The full app is also available at `/setup/rider` and `/setup/driver`, followed by `/matches`, `/matches/:id`, and `/ride`.

Run `npm run lint` and `npm run build` from `frontend/` before submitting a change. `npm run preview` serves the last production build, usually at [http://localhost:4173](http://localhost:4173).

## Test the prototype

Use **Restart demo** in the presenter panel between guided runs. At widths below 900px, open the panel with **Demo controls**. At **Create your account**, select a fictional student record in the panel, click **Fill in demo details**, then **Verify and create account**. On mobile, **Back to app** closes the panel.

| Flow | Steps | Expected behaviour |
| --- | --- | --- |
| Driver | Choose **I drive**. Keep Downtown Brampton → York Keele, 8:00 AM, weekdays. Continue through account, profile, matches, and shared route. | The default savings preview estimates 6 extra minutes and about $78/month with three riders. The final screen says **Route shared!** |
| Rider | Choose **I need a ride**. Keep Malton → York Keele, 8:00 AM, Mon/Wed/Thu. Continue to confirmation. | Nine drivers appear. The suggested ride costs $3 and saves about 19 minutes. The final screen says **Request accepted!** |
| Custom trip | Change the start, destination, time, and days. Search for a public pickup and try a custom map pin. | Guided sample commuters fit the entered trip. Ride preferences still apply. The map and route remain usable when external map services are unavailable. |
| Empty states | On Your savings, select **Preview: no riders found** or **Preview: no drivers found**. On Shared route, select **Preview: nobody selected**. | Each preview explains the next action. Drivers can choose an earlier suggested arrival time. Use the panel's back button to leave a preview. |
| Ride preferences | Verify the sample marked **Woman listed**. Try **At least one other woman** and **Women only**. | Women-only excludes other profiles. With **At least one other woman**, a driver's passengers include a woman on each shared day. Backup choices follow the preference too. |
| Selection limits | As a driver, choose passengers and adjust the detour limit from 5 to 20 minutes. | Seats and the whole-route detour are enforced. Over-limit routes explain the problem and offer **Raise my limit** when possible. |
| Multiple routes | From Home, add a route or open **View all routes** and **Add return route**. Change the schedule, save, and edit one route. | Routes keep separate days and matches after reload. Home shows the next trip across saved routes. |
| Backup and check-in | From Home, choose **Can’t drive?** or **Driver away?**, then a route and date. Try Undo. Check in as a rider, or simulate passenger check-in using the driver presenter controls. | An eligible replacement or an unavailable state appears. Undo restores the route. Check-in shows the arrival status. |
| Full app | Open `/setup/rider`, save the default trip, open a match, and request a ride. Repeat from `/setup/driver` with an offer. Try check-in, an away day, backup, and Reset. | Matches, near-miss explanations, match details, My ride, and reset remain usable. Reload preserves the trip and arrangement. |
| Navigation and appearance | Try Back, Restart, and reload during onboarding. Switch themes. Check at 320px and at desktop width, including a three-rider route. | Answers resume after reload, match selections clear when trip inputs change, text stays inside buttons, and both themes remain readable. |

The [demo flow](demo-flow.md) lists every screen and transition. The full app uses strict matching against its sample trips; the guided demo adapts its sample commuters to the tester's trip.

## Saved data and external services

The app has no backend. Accounts, student verification, ride requests, acceptances, backups, and check-ins are simulated. The browser stores:

| Key | Contents |
| --- | --- |
| `routemate-demo-v1` | Guided answers, current step, and saved routes |
| `routemate-prototype-v1` | Full-app trip profile and ride arrangement |
| `routemate-theme` | Explicit light/dark theme choice |

Preserve these keys and existing record IDs when changing stored data. The guided **Restart demo** and full-app **Reset** controls reset their respective flows.

The trip map requests OpenStreetMap tiles and OSRM road routes for listed places. Custom pins and offline fallback use a straight line. Google Fonts supplies Inter, with system fonts as fallback. Direction links open Google Maps, Apple Maps, or Waze. Matching calculations run locally and do not depend on these services. Locations sent to a map service are separate from the fictional account verification.

## GitHub Pages

The [Pages workflow](../.github/workflows/pages.yml) installs the lockfile with Node.js 24, runs `npm run build:pages`, and publishes only `frontend/dist`. It runs on pushes to `main` and `codex/judge-preview`, and can be started manually. Keep other branches separate until their changes are ready to publish.

A maintainer enables **GitHub Actions** under the repository's **Settings → Pages**. To check the deployment build locally, run from `frontend/`:

```bash
npm run build:pages
npm run preview
```

This build uses relative asset URLs and hash routes so it works under a repository subpath. Open the preview root and `http://localhost:4173/#/setup/rider`, then reload the deep link. The normal `npm run build` uses browser paths instead.

After deploying, check the [workflow run](https://github.com/zxcpivo/unhack-shenanigans/actions/workflows/pages.yml), open the [demo linked in the README](../README.md), and append `#/setup/rider` to that same site URL to check the deployed deep link.
