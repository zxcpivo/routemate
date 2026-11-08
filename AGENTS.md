# Working on Routemate

Use this guide when updating Routemate with an LLM or coding agent. Open the source repository at its root and ask the agent to read this file and the linked guide for the area you want changed.

## Project context

- [Agreed approach](project-context/approach.md) records product decisions and takes precedence over individual team notes. [Judging guide](project-context/unhack-prototype.md) covers the submission and what the prototype demonstrates.
- [Demo flow](docs/demo-flow.md) is the agreed screen flow. Update it in the same change when you add, remove or reorder a screen.
- [README](README.md) has setup, smoke tests, and publishing steps. [Frontend guide](frontend/README.md) walks through the screens. [Design system](frontend/DESIGN_SYSTEM.md) describes styling and interaction patterns.
- Routemate is a React and TypeScript prototype. Keep the demo data fictional. Accounts, requests, and check-ins are simulated in the browser. Present travel times and savings as estimates. Treat the interview simulations in the project notes as hypotheses.

## Where to make changes

| Change | Start here |
| --- | --- |
| Guided demo at `/` | [`DemoApp.tsx`](frontend/src/demo/DemoApp.tsx) owns step order, navigation, presenter notes, and saved answers. [`Steps.tsx`](frontend/src/demo/Steps.tsx) owns the screens and input choices. |
| Defaults, pickup order, group detour, or guided cost split | [`plan.ts`](frontend/src/demo/plan.ts) owns the role defaults and multi-rider route. [`RouteMap.tsx`](frontend/src/demo/RouteMap.tsx) draws the resulting stops. |
| Matching rules or distance estimates | [`matching.ts`](frontend/src/lib/matching.ts) runs the shared pairwise checks for overlapping days, detour, and arrival times. The fuller app's contribution suggestion also lives here and uses a separate formula from the guided demo. |
| Sample commuters or locations | [`demo.ts`](frontend/src/data/demo.ts) holds commuters and [`places.ts`](frontend/src/data/places.ts) holds place IDs and coordinates. `EXTRA_PLACES` adds searchable spots that no demo commuter uses. The guided start and destination search over both lists, and [`TripMap.tsx`](frontend/src/demo/TripMap.tsx) draws the draggable map. |
| Setup, match details, backup driver, or check-in | [`App.tsx`](frontend/src/App.tsx) registers the routes. [`pages/`](frontend/src/pages/) renders the screens, and [`store.tsx`](frontend/src/lib/store.tsx) owns the fuller app's profile and arrangement. |
| Styling or branding | [`tokens.css`](frontend/src/styles/tokens.css) holds design tokens. Use the shared controls in [`ui.tsx`](frontend/src/components/ui.tsx), the guided styles in [`demo.css`](frontend/src/styles/demo.css), and the logo in [`assets/brand/`](assets/brand/). |

## Behaviour to preserve

- The guided demo saves `routemate-demo-v1`. The fuller app saves `routemate-prototype-v1`. Preserve existing IDs and stored values, or handle old data when changing the shape. `placeById` throws for unknown IDs, except dragged pins stored as `pin:<lat>,<lng>`. Times are minutes after midnight and contributions are dollars per ride.
- The guided demo always finds matches: `castRiders` and `castDrivers` in [`plan.ts`](frontend/src/demo/plan.ts) fit the sample commuters to the tester's trip. The fuller app keeps strict matching. Error screens in the guided demo are reached through `DemoPreview` buttons.
- Changing role, destination, start, time, or days clears prior guided match selections. Keep the driver seat and whole-route detour checks when editing match selection. The default demo allows up to three riders and a 10-minute detour; drivers can adjust the limit from 5 to 20 minutes on Choose matches.
- `<html>` always has `data-theme="light"` or `"dark"`, set before first paint in `index.html` and kept by [`theme.ts`](frontend/src/lib/theme.ts). It follows the device until someone uses the presenter panel switch, then saves `routemate-theme`. Put dark colours under `:root[data-theme='dark']` in `tokens.css`, not a media query.
- The demo fills the screen on mobile and shows a phone frame with presenter notes at 900px and above. Preserve keyboard access, heading focus on step changes, and visible status text.
- The Starting point & Destination map loads OpenStreetMap tiles and an OSRM road route over the network. Offline, it still shows the pins and a dashed straight line, and the matching maths never depends on it.
- Local mode uses normal browser paths. The Pages build uses hash routes and relative asset URLs so it works under a repository subpath. The [Pages workflow](.github/workflows/pages.yml) publishes only the generated `frontend/dist` contents.

## Verify a change

1. Use Node.js 24. Run `npm ci`, `npm run lint`, and `npm run build` from `frontend/`.
2. Run the relevant [README smoke tests](README.md#test-the-prototype). For matching, location, or schedule changes, check both demo roles, the preview buttons for the no-match and nobody-selected screens, and the fuller setup route. If expected results change, update the demo guide and README to match.
3. For UI changes, check mobile and desktop widths, including 320px with three riders in the car: button text must stay inside its button. Try Back, Restart, and a reload partway through the flow when changing navigation or saved answers.
4. For hosting changes, run `npm run build:pages`. Check that the published root loads and that `/#/setup/rider` opens directly and survives a reload.

Example prompt for a collaborator's LLM

> Read `AGENTS.md`. Change the driver savings screen to show the cost per rider alongside the monthly estimate. Keep the matching rules and presets. Run the driver smoke test and report what you verified.
