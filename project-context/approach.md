# Routemate: project approach

_Last updated: 2026-11-07_

This is the team's agreed approach, built from `peter.md` and `canadianslav.md`. Where this file and a member's notes disagree, this file wins.

## Challenge

**Connected, Safe & Future-Ready Communities**

> How might we help make transportation safer, more affordable, and more available for fixed schedule commuters (work/school commuters)?

Use this original wording in the pitch. It matches the challenge text and doesn't assume the solution.

## Problem statement (for interviews)

> We believe students and workers in the suburban GTA without regular access to a car struggle to get to fixed-start classes and shifts on time and within budget when their trip needs a bus transfer or transit doesn't run at the hour they need. Today it is a choice between leaving early enough to absorb a missed connection, risking a late arrival, or paying for a backup ride.

**Root cause: two hypotheses, both still open**

- **A. Not enough affordable options:** the start time is fixed, and the affordable transport available can't reliably get people there by then.
- **B. Trust and coordination:** drivers and riders on the same route exist, but they don't know or trust each other, and informal carpools fall apart.

Interviews should tell us which one is true, or whether both are.

## Who it's for

- **Riders:** students and employees with a fixed start time on recurring days and no regular access to a car. Their transit trip needs at least one transfer, or doesn't run at the hour they need.
- **Drivers:** people who already drive a similar route at similar times, usually alone.
- **Not customers for now:** people with good, direct transit, and people whose schedule changes week to week (matching depends on a repeat trip).

## How Routemate works (working concept)

**Sign-up**

| | Rider enters | Driver enters |
|---|---|---|
| Start | Pickup location | Starting point |
| End | Destination | Destination |
| Time | Required arrival time | Required arrival time |
| Days | Recurring days | Recurring days |
| Limits | | Maximum detour (minutes), seats |

**Matching.** A rider is matched with a driver when:

1. Their recurring days overlap.
2. Picking up and dropping off the rider adds no more time than the driver's maximum detour. The driver chooses this limit; suggest 10 minutes as the default.
3. Both the driver and the rider arrive by their required times.

**After a match**

- Rider and driver agree on a contribution per ride, in advance, so payment is predictable.
- The same driver and rider ride together on their shared days.
- If the regular driver is away, Routemate finds a backup match.
- The rider checks in on arrival.

**Ideas to test (not decided)**

- **Meeting points:** let riders choose a nearby meeting point instead of their home address. It shortens the detour and keeps home addresses private.
- **Arrival buffer:** aim to arrive a few minutes before the required time, since being on time is the main pain.

**Later, only if interviews show a need:** ID verification, choosing riders or drivers by gender or age, and community groups (workplace, school, building).

## Privacy

- Data is encrypted, both when sent and when stored.
- Collect only what matching needs.

**Suggested rules**

- Show possible matches an approximate area, not an exact address, until both people accept.
- Share live location only during a trip, and delete trip location history afterwards.

## Evidence rules

- **Peter's six interviews in `peter.md` are simulated.** They are hypotheses, not evidence. Don't show their numbers or quotes as real (for example "$20–250 a month on Ubers"). Replace them with real interviews, or label them "based on simulated interviews."
- **Sourced numbers can be used with their links:**
  - Workers in the Toronto area averaged 47.6 minutes one way by transit and 25.5 minutes by car (2021 Census). These are different trips, so it isn't a direct comparison. [Statistics Canada](https://www.statcan.gc.ca/o1/en/plus/2697-gta-getting-there-automobile)
  - In a 2019 survey of Pearson airport workers who drove, 61% said too many connections kept them off transit. This is one workplace, so present it as an example. [Pearson workforce survey](https://author.torontopearson.com/-/media/project/pearson/content/corporate/who-we-are/workforce-study/pearson_workforce_survey_report.pdf?modified=20191002202759)
  - Brampton Transit's standard adult PRESTO fare is $3.55 from February 9, 2026. [Brampton Transit fare announcement](https://www.brampton.ca/EN/City-Hall/News/Pages/Service-and-Information-Update.aspx/652)

## Assumptions to test

| Assumption | Passes if interviews show |
|---|---|
| 1. The pain is frequent | A delay, late arrival, or paid backup ride at least once a week |
| 2. Trust affects choices | A real time when knowing the driver, or feeling safe, changed what someone did |
| 3. Enough drivers (biggest risk) | Drivers who make a matching trip on the same days and times and would commit to pickups within a detour they choose |

## Interview plan

- **Who:** at least 5 riders (a mix of students and workers) and at least 3 drivers.
- **Where to recruit:** the product stays general, but recruit around 2–3 shared destinations (for example one campus and one large employer area). Drivers and riders then have a real chance of overlapping, so the driver test means something.
- **Collect things you can show:** "looking for a ride" posts in local groups and Discords, and real transit trip times compared with start times.

**Rider questions**

1. Walk me through how you got to work or school and home last week. What time did you leave and arrive, and where did you wait or transfer?
2. Tell me about the last commute that went differently from what you planned, if there was one. What did you do, and what did it cost in time, money, or missed work or class?
   - Follow-up: what happened the last time you were late? What did it cost you?
3. Tell me about the last time you considered getting a ride from someone. What did you choose, and what mattered in that decision?
4. Was there a time a ride was available but you didn't take it? What stopped you? _(tells root cause A from B)_
5. Tell me about a carpool you had that ended, if you've had one. Why did it end?

**Driver questions**

1. Walk me through your drives to and from work or school last week. Which days, routes, and times were consistent, and what changed?
2. Tell me about the last time you arranged, offered, or turned down a ride on your commute. What influenced your decision? If you shared the ride, how did pickup and expenses work?
3. When you've given someone a ride, how far out of your way did you go?
4. What would make you stop driving someone?
5. Tell me about a carpool you had that ended, if you've had one. Why did it end?

**Don't ask:** about emissions, "Would you use…?" (it only produces weak signals), or questions aimed at people with good transit.

## Plan

1. **Agree:** done (this file).
2. **Real interviews:** run the interview plan above.
3. **Review and decide:** compare the real answers with the simulated ones, check each assumption against its pass mark, and pick the root cause. Then keep going, narrow the focus, or change direction.
4. **Smallest product:** sign-up, matching, agreed contribution, backup match and arrival check-in. Nothing else until interviews show a need.
5. **Demo and pitch:** choose between a clickable prototype and a working app. Pitch with sourced numbers, real interview quotes, UN Sustainable Development Goals 9, 11, 16 and 17, and the privacy rules above.

## Still open

- **Insurance and payment:** personal car insurance may not cover a driver who is paid more than a share of costs. Check before designing payments, and consider capping contributions at a share of gas and running costs.
- **Demo build:** clickable prototype or working app.
