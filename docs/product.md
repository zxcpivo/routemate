# Product decisions

This is the team's agreed product direction and takes precedence over earlier brainstorming. The implemented screens are documented in [demo-flow.md](demo-flow.md); the two supplied interviews are preserved in [research.md](research.md).

## Problem and audience

The original challenge is: “How might we help make transportation safer, more affordable, and more available for fixed schedule commuters (work/school commuters)?”

Routemate starts with university students commuting to York University's Keele campus on recurring days. Riders need a reliable trip to class; drivers already make a compatible trip and have seats to share. Outbound and return journeys are separate routes, and students can save different schedules for different class days.

Two hypotheses remain open: affordable transport may not fit a fixed start time, and people making compatible journeys may struggle with trust and coordination. The interviews do not yet establish which is the main problem or whether enough overlapping drivers are available.

## Core flow

1. Choose driver or rider, pickup/start, destination, arrival time, and recurring days.
2. Verify a fictional university email and student ID record, then select age, interests, and available ride preferences.
3. Find compatible students, review the route and cost estimate, and confirm the recurring arrangement.
4. Manage saved routes, look for an eligible backup when a driver is away, and check in on arrival.

The prototype runs entirely in the browser. All people, student verification, ride requests, acceptances, and check-ins are simulated. Real enrollment verification, payments, live trip tracking, and operational support are outside the current implementation.

## Matching rules

A driver and rider must have shared recurring days, fit within the driver's detour and seat limits, and arrive by their required times without arriving more than 20 minutes early. Applicable ride preferences also have to pass.

When a verified sample student record lists a student as a woman, she can choose **At least one other woman** or **Women only**. These preferences also apply to backups. For a driver group that requires another woman, each day with passengers must include a woman passenger.

Shared interests and age proximity rank eligible guided matches. Rider matches prioritize shared days first. The guided demo adapts fictional commuters to the entered trip; the full app checks the fixed sample trips directly. This distinction must remain visible in demo explanations.

The guided driver defaults to three seats and a 10-minute detour. The detour can be adjusted from 5 to 20 minutes. Changing trip or profile inputs clears draft match selections so old choices cannot silently carry over to a different trip.

## Travel and cost estimates

- Travel calculations use straight-line distance multiplied by 1.3 and an assumed speed of 45 km/h. Each pickup adds two minutes.
- The guided transit comparison uses a factor of 1.9. Its original reference was the 2021 Census Toronto-area averages, 47.6 minutes by transit and 25.5 by car. Those averages describe different trips, so this is only a demo estimate. [Original source](https://www.statcan.gc.ca/o1/en/plus/2697-gta-getting-there-automobile)
- Guided running cost is estimated at $0.20/km and divided across the driver and riders. Each rider's share is rounded to the nearest $0.50 with a $2 minimum. Monthly estimates use 4.33 weeks and the shared days.
- The full app keeps its separate contribution suggestion: estimated rider-distance cost, rounded to $0.50 with a $3 minimum, plus an adjustable cap. See `suggestedContribution` in `frontend/src/lib/matching.ts`.

These are prototype assumptions. They are not measured savings, live traffic estimates, payment commitments, or a settled commercial pricing policy. Matching remains independent of the map's external road-route response.

## Privacy and evidence

Use public meeting points and approximate areas before acceptance; share the agreed pickup after confirmation. The prototype saves state in browser local storage. Map and font services make external requests, so it should not be described as encrypting stored account data or keeping every location on the device.

There are two supplied, self-reported interviews: one driver and one transit passenger. Earlier simulated interviews are hypotheses, not customer evidence. Neither participant has booked or paid for Routemate in the evidence supplied, and the two participants do not have compatible journeys.

The next validation step is to find actual overlapping trips, confirm the driver's acceptable detour and recurring commitment, and test an agreed contribution. A real service would also need decisions on verification, cancellations, support, insurance, and any service fee.
