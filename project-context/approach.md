# Routemate: project approach

_Last updated: 2026-11-08_

This is the team's agreed approach, built from everyone's notes in this folder: `peter.md`, `canadianslav.md`, `gleb.md` and `prompt-4-value-proposition-minhdang.md`. Where this file and a member's notes disagree, this file wins.

## Challenge

**Connected, Safe & Future-Ready Communities**

> How might we help make transportation safer, more affordable, and more available for fixed schedule commuters (work/school commuters)?

Use this original wording in the pitch. It matches the challenge text and doesn't assume the solution.

## Problem statement (for interviews)

> We believe university students in the suburban GTA without regular access to a car struggle to get to classes, labs and tutorials on time and within budget when their trip needs a bus transfer or transit doesn't run at the hour they need. Today it is a choice between leaving early enough to absorb a missed connection, risking a late arrival, or paying for a backup ride.

**Root cause: two hypotheses, both still open**

- **A. Not enough affordable options:** the start time is fixed, and the affordable transport available can't reliably get people there by then.
- **B. Trust and coordination:** drivers and riders on the same route exist, but they don't know or trust each other, and informal carpools fall apart.

Interviews should tell us which one is true, or whether both are.

## Who it's for

- **Riders:** university students who commute to campus on recurring days and no regular access to a car. Their transit trip needs at least one transfer, or doesn't run at the hour they need.
- **Drivers:** university students who already drive to campus on a compatible schedule and have seats to share.
- **Not customers for now:** people with good, direct transit, and people whose schedule changes week to week (matching depends on a repeat trip).

**First campus: York University’s Keele campus.** Start with recurring class trips to campus and the trip home. Students can save separate routes for different days and arrival times.

## How Routemate works (working concept)

**Sign-up**

| | Rider enters | Driver enters |
|---|---|---|
| Start | Pickup location | Starting point |
| End | University campus or a meeting point for the trip home | University campus or a meeting point for the trip home |
| Time | Required arrival time | Required arrival time |
| Days | Recurring days | Recurring days |
| Limits | | Maximum detour (minutes), seats |
| Student verification | University email and student ID number | University email and student ID number |
| Profile | Age, interests and ride preference when available | Age, interests and ride preference when available |

**Matching.** A rider is matched with a driver when:

1. Their recurring days overlap.
2. Picking up and dropping off the rider adds no more time than the driver's maximum detour. The driver chooses this limit; suggest 10 minutes as the default.
3. Both the driver and the rider arrive by their required times.
4. The ride meets any applicable gender preferences. When a verified student record lists a student as a woman, she can require at least one other woman on each shared day or choose rides with only women. These rules apply to backup drivers too.

Age proximity and shared interests help rank students who pass the ride checks. The prototype checks the university email and student ID number against fictional records. It does not verify real university enrollment or process ID documents.

**After a match**

- Rider and driver agree on a contribution per ride, in advance, so payment is predictable.
- The same driver and rider ride together on their shared days.
- If the regular driver is away, Routemate looks for a backup who meets the ride requirements.
- The rider checks in on arrival.

**Ideas to test (not decided)**

- **Meeting points:** let riders choose a nearby meeting point instead of their home address. It shortens the detour and keeps home addresses private.
- **Arrival buffer:** aim to arrive a few minutes before the required time, since being on time is the main pain.
- **Same-day backups:** when the regular driver is away, offer the ride to any matching driver who is free that day. This is how Gleb's notes describe matching.

**Later, only if interviews show a need:** University affiliation verification and campus-specific groups.

## Alternatives to beat

| Alternative | Why people stick with it | Where Routemate has to do better |
|---|---|---|
| Keep the current routine (leave earlier) | Costs no extra fare | Only worth switching if people lose real time or money. If not, this is the strongest competitor. |
| Transit | Cheap: a TTC tap is $3.30, and One Fare cuts eligible transfer costs | A tight connection still makes people late for a fixed start |
| Uber or taxi | Direct, and can be booked ahead | Expensive if used often, and booked one trip at a time |
| Lifts from friends, family or group chats | People already trust them | Someone has to keep asking and cover cancellations |
| York Smart Commute, Poparide | Already match by destination; Poparide verifies York students | Routemate has to keep a regular ride going for exact days and pickup times |

Lead the pitch with getting there on time and knowing who is picking you up. Verification, tracking and filters are features, not the reason to switch.

Sources: [TTC fares](https://www.ttc.ca/news/2026/September/Back-to-school-on-the-TTC), [One Fare](https://www.metrolinx.com/en/projects-and-programs/fare-integration/one-fare-program), [Uber Toronto](https://www.uber.com/global/en/r/cities/toronto-on-ca/), [York Smart Commute](https://www.yorku.ca/parking/smart-commute/), [Poparide for York students](https://www.poparide.com/en-ca/edu/yorku)

## Privacy

- Data is encrypted, both when sent and when stored.
- Collect only what matching needs.

**Suggested rules**

- Show possible matches an approximate area, not an exact address, until both people accept.
- Share live location only during a trip, and delete trip location history afterwards.

## Evidence rules

- **We have no real interviews yet.** Every note in this folder is a hypothesis until real interviews back it up.
- **Peter's six interviews in `peter.md` are simulated.** Don't show their numbers or quotes as real (for example "$20–250 a month on Ubers"). Replace them with real interviews, or label them "based on simulated interviews."
- **Sourced numbers can be used with their links:**
  - Workers in the Toronto area averaged 47.6 minutes one way by transit and 25.5 minutes by car (2021 Census). These are different trips, so it isn't a direct comparison. [Statistics Canada](https://www.statcan.gc.ca/o1/en/plus/2697-gta-getting-there-automobile)
  - York students averaged 57.4 minutes one way in the 2019 StudentMoveTO survey. [York survey results](https://www.torontomu.ca/city-building/news-research/2020/10/StudentMoveTO-survey-results/)
  - York reports over 52,000 students at Keele. [York campus figures](https://www.yorku.ca/campuses/)
  - In a 2019 survey of Pearson airport workers who drove, 61% said too many connections kept them off transit. This is one workplace, so present it as an example. [Pearson workforce survey](https://author.torontopearson.com/-/media/project/pearson/content/corporate/who-we-are/workforce-study/pearson_workforce_survey_report.pdf?modified=20191002202759)
  - Brampton Transit's standard adult PRESTO fare is $3.55 from February 9, 2026. [Brampton Transit fare announcement](https://www.brampton.ca/EN/City-Hall/News/Pages/Service-and-Information-Update.aspx/652)

## Assumptions to test

| Assumption | Passes if interviews show |
|---|---|
| 1. The pain is frequent | A delay, late arrival, or paid backup ride at least once a week |
| 2. Trust affects choices | A real time when knowing the driver, or feeling safe, changed what someone did |
| 3. Enough drivers (biggest risk) | Drivers who make a matching trip on the same days and times and would commit to pickups within a detour they choose |

## Interview plan

- **Who:** 10 student riders at Keele and at least 3 students who already drive to campus at similar times. Include a few people who are happy with transit, to learn who doesn't need Routemate.
- **When:** over the next week.
- **How to recruit:** follow the recruitment table in `gleb.md`: classmates, campus common areas near transit stops, referrals from interviewees, and student commuter groups.
- **Record for each interview:** rough start and end point, days, required arrival time, door-to-door time, actual costs and who pays, what they've tried, and what happened when a trip went wrong. Keep quotes separate from the team's interpretation.
- **Afterwards:** map the trips to find a route and arrival window where riders and drivers overlap.
- **Collect things you can show:** "looking for a ride" posts (York students already post them on r/yorku), and real transit trip times compared with start times.

**Rider questions**

1. Walk me through how you got to campus and home last week. What time did you leave and arrive, and where did you wait or transfer?
2. Tell me about the last commute that went differently from what you planned, if there was one. What did you do, and what did it cost in time, money, or missed class or lab time?
   - Follow-up: what happened the last time you were late? What did it cost you?
3. Walk me through what you spent on transportation last week and how those costs were covered.
4. What, if anything, affects how safe or comfortable you feel during the journey? Can you describe a recent example?
5. Tell me about the last time you considered getting a ride from someone. What did you choose, and what mattered in that decision?
6. Was there a time a ride was available but you didn't take it? What stopped you? _(tells root cause A from B)_
7. Tell me about a carpool you had that ended, if you've had one. Why did it end?

**Driver questions**

1. Walk me through your drives to and from campus last week. Which days, routes, and times were consistent, and what changed?
2. Tell me about the last time you arranged, offered, or turned down a ride on your commute. What influenced your decision? If you shared the ride, how did pickup and expenses work?
3. When you've given someone a ride, how far out of your way did you go?
4. What would make you stop driving someone?
5. Tell me about a carpool you had that ended, if you've had one. Why did it end?

**Don't:** ask about emissions, ask "Would you use…?" (it only produces weak signals), ask questions aimed at people with good transit, or suggest prices before learning what people spend now.

## Plan

1. **Agree:** done (this file).
2. **Real interviews:** run the interview plan above at Keele this week.
3. **Review and decide:** compare the real answers with the simulated ones, check each assumption against its pass mark, map the trips, and pick the root cause. Then keep going, narrow the focus, or change direction.
4. **Smallest product:** sign-up, matching, agreed contribution, backup match and arrival check-in. Nothing else until interviews show a need.
5. **Demo and pitch:** choose between a clickable prototype and a working app. Show matching on real interview trips, or made-up trips clearly labelled as such, and include a case where no match exists. Pitch with sourced numbers, real interview quotes, UN Sustainable Development Goals 9, 11, 16 and 17, and the privacy rules above.

## Still open

- **Insurance and payment:** personal car insurance may not cover a driver who is paid more than a share of costs. Check before designing payments, and consider capping contributions at a share of gas and running costs.
- **Service fee:** Minh Dang's notes have the app take a fee on each ride. Decide whether Routemate charges one, and how it fits with capping contributions at a share of costs. Compare the rider's total with what they pay now: at an example $5 a ride, a rider saves money replacing a $20 Uber but pays more than a $3.30 TTC tap.
- **Demo build:** clickable prototype or working app.
