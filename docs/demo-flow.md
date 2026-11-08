# Routemate demo flow

Every screen in the guided demo and the full app, and what moves you between them.

```mermaid
flowchart LR
  subgraph laneA["Guided demo · /"]
    welcome["Welcome<br/><small>Start</small>"]
    role["Driver or rider<br/><small>Step 1 of 8</small>"]
    start["Starting point & Destination<br/><small>Step 2 of 8</small>"]
    time["Arrival time<br/><small>Step 3 of 8</small>"]
    pitch["Your savings<br/><small>Step 4 of 8</small>"]
    pitchEmpty{{"No one on your route yet<br/><small>Alternate screen</small>"}}
    account["Create account<br/><small>Step 5 of 8</small>"]
    profile["Age, interests & ride preferences<br/><small>Step 6 of 8</small>"]
    choose["Choose matches<br/><small>Step 7 of 8</small>"]
    route["Shared route<br/><small>Step 8 of 8</small>"]
    routeEmpty{{"Pick a match first<br/><small>Alternate screen</small>"}}
    done["Route shared! / Request accepted!<br/><small>Confirmation</small>"]
    home["Home"]
    routes["Your routes"]
    manage["Add or edit a route<br/><small>Role, places and schedule</small>"]
    homeCheckIn{{"Checked in · on time<br/><small>On-page state</small>"}}
    homeBackup["Find a backup<br/><small>Choose a route, then a day</small>"]
    navApp[/"Navigation app<br/><small>Opens in a new tab</small>"/]
  end
  subgraph laneB["Full app · /setup, /matches, /ride"]
    setup[/"Your campus commute<br/><small>/setup/:role</small>"/]
    matches[/"Drivers / Riders on your route<br/><small>/matches</small>"/]
    detail[/"Match details<br/><small>/matches/:id</small>"/]
    ride[/"My ride<br/><small>/ride</small>"/]
    checkedIn{{"Checked in · on time<br/><small>On-page state</small>"}}
    backup{{"Backup driver<br/><small>On-page state</small>"}}
    matchesEmpty{{"No match on this route yet<br/><small>Empty state</small>"}}
    rideEmpty{{"No regular ride yet<br/><small>Empty state</small>"}}
  end
  welcome -->|"Get started"| role
  start -->|"Continue"| time
  time -->|"Find my matches"| pitch
  pitch -->|"Preview: no riders / drivers found"| pitchEmpty
  pitchEmpty -->|"Try another starting point"| start
  pitchEmpty -->|"Change my arrival time"| time
  pitchEmpty -->|"Back to my matches"| pitch
  pitchEmpty -->|"Pick an earlier arrival time (driver)"| pitch
  pitch -->|"Continue"| account
  account -->|"Verify and create account"| profile
  profile -->|"Continue"| choose
  choose -->|"See my route"| route
  route -->|"Preview: nobody selected"| routeEmpty
  routeEmpty -->|"Back to matches"| choose
  routeEmpty -->|"Back to my route"| route
  route -->|"Share route / Send to …"| done
  done -->|"Go to my home"| home
  home -->|"Check in"| homeCheckIn
  home -->|"Can’t drive? / Driver away?"| homeBackup
  homeBackup -->|"Back to home"| home
  home -->|"Open in Google Maps / Apple Maps / Waze"| navApp
  home -->|"View all routes"| routes
  home -->|"Add a route"| manage
  routes -->|"Add, edit or reverse a route"| manage
  routes -->|"Back to home"| home
  manage -->|"Find my matches"| choose
  manage -->|"Cancel"| routes
  setup -->|"Find drivers / Find riders"| matches
  matches -->|"Edit"| setup
  matches -->|"Tap a match card"| detail
  detail -->|"All matches"| matches
  detail -->|"Ask for a ride / Offer a seat"| ride
  matches -->|"Go to my ride"| ride
  matches -->|"Nobody fits"| matchesEmpty
  matchesEmpty -->|"Change my trip"| setup
  ride -->|"No ride yet"| rideEmpty
  rideEmpty -->|"See matches"| matches
  ride -->|"Check in"| checkedIn
  ride -->|"Find a backup"| backup
  role -->|"Continue"| start
```

## Screens

### Guided demo · /

The walkthrough judges see at /. The first route has eight numbered steps. Adding or editing a route reuses five steps and keeps the existing account and profile. Answers are kept in this browser, so a reload resumes the same step.

| Screen | Tag | What it shows |
|---|---|---|
| Welcome | Start | “Wanna be my routemate?” and what Routemate does. |
| Driver or rider | Step 1 of 8 | “How do you get there?” Picking a card moves on by itself. |
| Starting point & Destination | Step 2 of 8 | **Plan your trip** shows two search fields and a draggable map that fits the available space. Drivers choose a starting point and riders choose a public pickup. For the first route, the destination is a campus. Pickup search shows public venues near the current pickup and warns against sharing a home address when a search has no public match or a custom pin is selected. Use the map for custom pickups. |
| Arrival time | Step 3 of 8 | “When do you need to be there?” Drag the hour, minute (5-minute steps) and AM/PM wheels; starts at 8:00 AM. Then which days. |
| Your savings | Step 4 of 8 | “Good news”: money back for drivers and original trip time then added trip time, time, reliability, and cost for riders. Shown before any account. |
| No one on your route yet | Alternate screen | Testers can open this with “Preview: no riders found” (or drivers) in the presenter panel while on Your savings. “Back to my matches” in the panel ends the preview. Drivers also see “Could you arrive a little earlier?” with up to three earlier arrival times (10, 20 and 30 minutes earlier) that have riders, each with the rider count, added drive time and monthly saving; tapping one sets that time and returns to Your savings. |
| Create account | Step 5 of 8 | Enter a name, university email and student ID number. Choose a sample student in the presenter panel and use “Fill in demo details” to try verification. |
| Age, interests & ride preferences | Step 6 of 8 | Drag the age slider (18 and up) and tap any topics you like. If the verified sample record lists the student as a woman, she can choose At least one other woman or Women only. Shared interests and age proximity help rank eligible matches. |
| Choose matches | Step 7 of 8 | Driver: “pick your passengers” within seats and the 10-minute detour limit. The limit can be typed or stepped (5–20 min); if the route goes over it, “Raise my limit to … min” accepts the new time in one tap. Rider: “pick your driver”. |
| Shared route | Step 8 of 8 | Map, pickup times and the even cost split, to check before sharing. |
| Pick a match first | Alternate screen | Use “Preview: nobody selected” in the presenter panel while on Shared route. “Back to my route” in the panel ends the preview. |
| Route shared! / Request accepted! | Confirmation | Who is riding and the weekly pattern. The other side's yes is simulated. “Go to my home” continues. |
| Home | Dashboard | The next departure or pickup across all saved routes, who is riding, map and directions, and an estimated cost or savings. “Add a route” starts setup for another trip. |
| Your routes | Route management | View saved routes and schedules. Edit one or start a return trip with the endpoints reversed and a suggested 6:00 PM arrival. |
| Find a backup | Route and day | Choose the route first, then a scheduled date. See the replacement driver if one is available, or use Undo to clear the request. |
| Navigation app | External link | On Home, “Open the route in” (driver) or “Get to your pickup with” (rider): Google Maps, Apple Maps or Waze in a new tab. Google Maps loads the start, every pickup and the destination; Apple Maps and Waze web links take one destination, so they open the first pickup (driver) or the meeting point (rider, walking directions). |
| Checked in | On-page state | Riders select “I've arrived” on Home. Drivers see the check-in status after “Simulate passengers checking in” is selected in the presenter controls. |
| Demo always matches | Note | Sample commuters are fitted to whatever trip the tester enters (destination, time, days, and moved onto the route if needed), to provide candidates for the entered trip. Ride preferences still constrain matches and backups. |
| Back, resume and presenter notes | Note | Every numbered step has a Back arrow to the screen you came from. Changing role, endpoints, time, days, age, interests or ride preferences clears the draft match selection. From 900px wide the demo sits in a phone frame with presenter notes beside it. The presenter panel houses the demo notices, test details, preview toggles, restart, theme switch, and simulated passenger check-in. On mobile, **Demo controls** opens the presenter panel. **Back to app** returns to the current step. |

### Full app · /setup, /matches, /ride

The fuller prototype with its own saved trip. The header shows Matches and My ride once a trip is set up; the logo returns to the guided demo.

| Screen | Tag | What it shows |
|---|---|---|
| Your campus commute | /setup/:role | Role, start, destination, arrive-by, days and detour limit. Switching role swaps the address. |
| Drivers / Riders on your route | /matches | Trip summary, match cards, and near misses with the reason each one fails. |
| Match details | /matches/:id | Person, route, times and suggested contribution. Exact meeting point only after you both accept. |
| My ride | /ride | Accepted note, week strip, next trip with check-in, and away days. |
| Checked in · on time | On-page state | “I've arrived” (rider) or “Simulate … checking in” (driver) swaps the button for the arrival time. |
| Backup driver | On-page state | Pick an away day, then “Find a backup”: “Backup on Thu: …” or “No backup found”. Undo clears it. |
| No match on this route yet | Empty state | Shown on /matches when nobody fits the trip. |
| No regular ride yet | Empty state | Shown on /ride before anyone has accepted. |
| Redirects | Note | With no trip set up, /matches, /matches/:id and /ride send you to /. Unknown addresses go to /. Reset in the footer clears the trip and opens /setup/rider. |
