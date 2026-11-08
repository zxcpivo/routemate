# Routemate frontend (clickable prototype)

The home page is a **guided demo** for judges: university students can set up a campus carpool and see how their route comes together. Every screen has an answer filled in, so you can tap straight through in about a minute, or change answers to try your own trip.

Everything runs in the browser. Student verification checks fictional records only. There is no backend: the people and trips are made up (`src/data/demo.ts`), accounts and requests are simulated, and nothing typed in leaves the device.

## Run it

Follow the [local launch steps](../README.md#launch-locally) and [smoke tests](../README.md#test-the-prototype) in the root README. See [AGENTS.md](../AGENTS.md) for the source map and guidance on making changes.

On a laptop or projector (900px wide or more) the demo shows inside a phone frame, with the presenter panel beside it. Expand **Walkthrough** to see the steps. On mobile, use **Demo controls** to open the presenter panel.

## The demo, step by step

| # | Screen | What happens |
|---|---|---|
| 0 | Welcome | "Wanna be my routemate?" and how the app pairs commuters |
| 1 | Driver or rider | Tap one; it moves on by itself |
| 2 | Starting point & Destination | Riders can search nearby public pickup spots. Unmatched searches and custom pins show a warning against sharing a home address. Use the map to set a custom pickup. Prefilled with the role's default and York Keele |
| 3 | Arrival time and days | Drag-to-pick wheel in 5-minute steps, starting at 8:00 AM |
| 4 | Your savings | Driver: "save about $78/month on gas, +6 min to your drive". Rider: trip time by transit, then with a routemate, plus reliability and cost per ride |
| 5 | Create account | Use a university email and student ID number. **Fill in demo details** copies a fictional record from the presenter panel |
| 6 | Age, interests & ride preferences | Choose an age (18 and up) and tap interests. A verified sample record that lists the student as a woman unlocks the two ride preferences |
| 7 | Choose matches | Driver picks up to 3 passengers and can type or step the detour limit (10 minutes by default); the detour and savings update live and block anything over the limit, with a **Raise my limit** button to accept the extra time. Rider picks a driver |
| 8 | Shared route | Drawn map, pickup times, days and money |
| 9 | Done | Everyone accepted (simulated) and what happens each week. **Go to my home** continues |
| 10 | Home | Upcoming trip across all saved routes, directions, check-in, estimates, and links to add a route, view or edit routes, or find a backup |

**Good demo paths**

- **Driver:** I drive → Downtown Brampton → 8:00 AM, Mon–Fri. The savings preview shows 8 riders on the route, +6 min with three pickups, and about $78 a month.
- **Rider:** I need a ride → Malton → 8:00 AM, Mon/Wed/Thu. 9 drivers, $3 a ride, about 19 min faster than transit.
- **Any trip works:** the demo fits its sample commuters to whatever you enter, to provide candidates for the trip. Ride preferences still apply.
- **No match:** tap **Preview: no riders found** in the presenter panel while on Your savings. The app says so plainly and offers to change the start or the time. Drivers also get earlier arrival times that have riders, one tap each.

The presenter panel includes demo notices, test details, preview toggles, **Restart demo**, the theme switch and **Simulate passengers checking in** when a driver trip is next.

## Fuller app screens

The earlier screens are still there for deeper questions: near misses with the reason each one fails, backup driver for a given day, and arrival check-in. Open http://localhost:5173/setup/rider or `/setup/driver`.

## How the numbers work

- **Matching:** the three rules from `project-context/approach.md`: shared days, detour within the driver's limit (10 minutes in the demo), and everyone arrives on time. Ride preferences also apply to backup drivers. The guided demo ranks eligible matches by shared interests, then by age proximity. For riders, more shared days still come first.
- **Travel times:** estimated from straight-line distance (×1.3 for roads, 45 km/h). Transit time is the car time ×1.9, a rough ratio from the 2021 Census averages (47.6 vs 25.5 min). These are estimates, not routing.
- The guided demo divides the estimated running cost ($0.20/km) across the driver and riders, rounds each rider's share to the nearest $0.50, and applies a $2 minimum. See the proposed cost-sharing policy in the [project approach](../project-context/approach.md).
- **Assumptions to test:** the $0.20/km figure, and that nobody arrives more than 20 minutes early.

## Where things are

| Path | What it holds |
|---|---|
| `DESIGN_SYSTEM.md` | Tokens, components and writing rules |
| `src/demo/` | The guided demo: shell, steps, route maths, drawn map |
| `src/styles/` | Design tokens, component styles, demo styles |
| `src/components/` | Shared UI components |
| `src/lib/matching.ts` | Matching rules and travel-time estimates |
| `src/data/` | Meeting points and made-up demo people |
| `src/pages/` | Fuller app screens: trip setup, matches, match detail, my ride |
