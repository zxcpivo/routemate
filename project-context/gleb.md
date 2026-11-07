# Gleb: Ideal Customer Profile and customer discovery plan

_Last updated: 2026-11-07_

**Status:** Provisional analysis. No real customer interviews, sign-ups, bookings, or payments have been provided. The customer profile, segment ratings, and proposed benefits are hypotheses to test.

## Context and sources

**UNHack challenge:** Connected, Safe & Future-Ready Communities.

**Starting HMW:** How might we help make transportation safer, more affordable, and more available for fixed-schedule commuters, particularly work and school commuters?

**Idea:** Match passengers with drivers already making a similar journey. Passengers contribute toward travel costs; drivers accept a small pickup/drop-off detour. Around ten extra minutes was suggested, but acceptable detours and contributions have not been validated.

This analysis combines Gleb's answers in the planning chat with the existing team notes:

- [canadianslav.md](canadianslav.md): problem framing, driver-led scheduling, cost sharing, background research, and a proposed Brampton-to-Pearson early-shift segment.
- [peter.md](peter.md): recurring matching, community trust, backup arrangements, and **explicitly simulated interviews**. The simulated quotes, spending figures, and counts are not customer evidence.
- [prompt-4-value-proposition-minhdang.md](prompt-4-value-proposition-minhdang.md): a proposed peak-hour worker segment, two or three passengers, and a service fee. It explicitly states that customer evidence is absent.

Gleb directly identified suburban students as a group of interest and said he can reach student transit users, drivers, and students who also work. The other files contain alternative starting segments, not an agreed replacement for this student focus. Existing public research is background; it does not validate this specific campus segment.

## Answers already available to the five clarifying questions

| Question | Answer available from the chat and repo | Remaining uncertainty |
| --- | --- | --- |
| Where would we launch? | Toronto/GTA, because Gleb lives there and can reach people locally. The repo separately proposes Brampton-to-Pearson trips. | No particular campus, corridor, or arrival window has been chosen. |
| Which commute is difficult? | Suburban students travelling to campus on fixed schedules. Gleb raised safety concerns; team notes also propose long journeys, transfers, and unreliable connections as problems. | Actual incidents, consequences, and the relative importance of safety, time, reliability, and cost. |
| What alternatives exist? | Transit and taxis/ride-hailing were identified in the chat. Team notes also suggest lifts from friends or family, informal carpools, and leaving earlier. | Actual alternatives used, door-to-door times, and out-of-pocket costs for this segment. |
| Who can we interview? | Gleb says he can reach students who use transit, students who drive, and students who also work. | A named campus and confirmed participants. Access to particular employers is not established. |
| What would each side commit to? | Drivers would already be making the trip; passengers would contribute toward costs. Gleb described matching when a driver becomes available. Team notes propose recurring arrangements and agreed contributions. | Instant versus advance/recurring matching, acceptable waiting and detour time, passenger prices, driver incentives, and cancellation arrangements. |

There is enough context for a provisional ICP and interview plan. The unknowns above remain visible rather than being filled with invented findings.

## 1. Three candidate customer segments

These are **passenger segments**. Drivers form a separate supply-side group with different needs. Someone can be a driver on one trip and a passenger on another; evaluate each trip separately.

Scores run from 1 to 5: greater pain, more frequent exposure, greater ability to pay, and easier recruitment respectively. Scores are prioritization hypotheses, not survey results. Ability to pay does not establish willingness to pay.

| Candidate passenger segment | Pain severity | Frequency | Ability to pay | Ease of reaching them |
| --- | --- | --- | --- | --- |
| Adult students commuting from suburbs to one campus, without dependable car access, with a long or complicated transit journey | **4/5:** a serious problem if delays, cost, or uncomfortable travel conditions affect attendance or other commitments | **4/5:** recruit students attending at least three days weekly | **2/5:** budget constraints are plausible; actual budget and payer unknown | **5/5:** Gleb already has access to students |
| Adult students who work, travelling home after evening shifts when transit options are limited | **4/5:** potentially difficult waits, missed connections, or expensive backup trips | **3/5:** depends on shift frequency and timetable stability | **2/5:** employment income does not establish spare transport spending | **4/5:** reachable through student networks and student coworkers |
| Brampton workers without regular car access, needing a bus transfer to reach fixed early shifts at one Pearson-area workplace | **5/5:** potentially severe if lateness affects income or employment | **5/5:** target recurring journeys on scheduled working days | **3/5:** potentially more regular income, but affordability is untested | **2/5:** the repo proposes this group, but no workplace access is confirmed |

The second and third segments should be evaluated for the particular trip described. They are not evidence that all evening workers or Pearson-area commuters need a new service.

## 2. Recommended starting segment

**Start discovery with adult suburban students commuting to one campus that Gleb can readily access.**

Working recruiting criteria:

- Age 18 or older and attending the same college or university campus.
- In-person attendance at least three days per week, with some required arrival times.
- No dependable access to a car for those trips.
- A usual transit journey of roughly an hour or more, or transfers that make arrival difficult to predict.

The age, frequency, and journey thresholds are research boundaries, not validated characteristics of the best customer. A long journey alone does not establish dissatisfaction. Include people who are satisfied with transit to understand who needs no change.

This is a practical starting point because Gleb can recruit this group directly, the journeys repeat, and a common campus gives possible matches a shared destination. It also permits a hackathon demonstration based on journey times, schedule overlap, costs, and driver detours. Actual demand still needs testing.

**Launch geography matters:** Toronto is the overall setting. A useful first service area would be one campus, one suburban corridor, and one compatible arrival window. Map the initial interviews before choosing the corridor. Scattered users across the city may produce no usable matches.

**Separate driver profile:** People already driving to that campus at compatible times, with an available seat. Discover their tolerance for coordination, waiting, detours, and recurring commitments. Do not assume drivers share passengers' financial circumstances or that fuel savings outweigh inconvenience.

**Working problem statement:** We believe adult students without dependable car access struggle to reach fixed campus commitments within their time and transport budgets when their suburban transit journey is long or unpredictable. We need to establish the consequences, how they respond today, and whether a different arrangement would improve their situation.

Safety remains a discovery topic. Do not infer a crime trend, reduced judgment, or an inability to handle danger from someone being a student. Children would involve different users and decision-makers, including parents or schools, and are outside this initial cohort.

## 3. One-page customer profile

_All descriptions below are hypotheses. No customer persona has been validated._

**Who they are.** An adult student at one accessible Toronto-area campus, living in a suburban neighbourhood and travelling to campus several days weekly. They lack dependable car access for these journeys. They may also work, but employment is not a requirement. Who ultimately pays for their transportation is unknown.

**Their context.** Classes, labs, placements, or other required commitments impose arrival times they cannot freely change. Their journey is lengthy or involves connections that make timing difficult. Their schedule may repeat weekly while differing between weekdays. The return journey also matters: an outbound match does not solve getting home. The app concept assumes usable phone and data access, which should be checked.

**Their goals.** Arrive predictably, keep spending manageable, feel comfortable during travel, and preserve time for study, sleep, employment, and social activities. Discovery must establish the priority order and what trade-offs they already make.

**Their biggest possible frustrations.** Building a large time buffer into the day; waiting after a missed connection; losing study or work time; uncomfortable waiting or walking conditions; paying for a backup trip; or depending on someone else for a lift. These are possibilities to investigate. Some students may value transit time for reading or rest and feel little need to change.

**How they solve it today.** Likely options to investigate are transit, different departure times, choosing different class times where possible, lifts from friends or family, informal carpools, and occasional taxis or ride-hailing. Ask what they actually used recently, what worked, and why any alternative stopped working.

**What it costs them.** Actual spending and time costs are unknown. Capture fares after discounts or passes, backup-trip spending, door-to-door time, waiting, precautionary time buffers, and any missed commitments. A contribution cheaper than a taxi can still cost more than their current transit trip. Passes, fare caps, and regional fare integration affect the comparison; use the individual's actual payment arrangement. Relevant official references are [TTC fares](https://www.ttc.ca/Fares-and-Passes) and [regional travel and One Fare](https://www.ttc.ca/Fares-and-passes/Regional-travel-and-One-Fare).

**Triggers for seeking something new.** Possible triggers include a changed timetable, repeated disruption, a new job, losing access to family lifts, an uncomfortable experience, or an exhausting journey. Stronger evidence would be a recent attempt to find another option, changed travel behaviour, or actual spending to avoid a problem. These observations would guide a narrower profile.

## 4. Riskiest assumptions and Five Whys prompts

Start with the question below, then follow the person's answer with neutral causal probes such as "What made that important?" or "What led to that?" Continue until the underlying constraint becomes clear. Do not invent their answers or mechanically repeat "why" five times.

| Assumption to test | Starting question for deeper probing |
| --- | --- |
| The problem is painful enough to change behaviour, rather than a general dislike of commuting. | "What made you change or keep your travel arrangements after your last difficult commute?" |
| Safety is the main concern, rather than reliability, time, or cost. | "Of the difficulties you've described, why does that one affect your decisions most?" |
| Passengers can and will contribute enough to sustain a useful arrangement. | "What led you to spend, or avoid spending, extra on your last difficult trip?" |
| Passengers would trust an unfamiliar driver, and community membership would meaningfully affect that decision. | "What has determined whom you are comfortable accepting a lift from?" |
| Drivers will accept coordination and around ten added minutes in exchange for the proposed benefit. | **Ask drivers:** "What explains your decision to drive alone or share your most recent commute?" |
| Enough drivers and passengers have compatible routes, arrival times, and return journeys. | **Ask both sides:** "Why do you leave at that particular time, and what would changing it affect?" |
| Matching when a driver becomes available provides enough certainty for a fixed arrival time. | "Why did you arrange your last time-critical journey as early or as late as you did?" |
| Existing alternatives leave an important gap that the proposed service could address. | "What has kept you using your current arrangement, and what happened when you last considered changing it?" |

Age or sex preferences, community badges, tracking, check-ins, and backup matches are proposed features. A preference or reassuring interface is not evidence of reduced danger or actual use. Ask about trust and past choices before deciding which features belong in the prototype.

## 5. Eight open-ended passenger interview questions

Use these before describing the app so participants' accounts are not shaped by the proposed solution. Seek specific recent events, allow "nothing went wrong," and record both positive and negative experiences.

1. **Walk me through your most recent journey to campus, from leaving home to reaching your destination.**
2. **What did your travel look like over the past week, including when you needed to arrive and how you got home?**
3. **Tell me about the most recent commute that went differently from your plan, if there was one. What happened afterward?**
4. **How did you decide how to travel on your last campus day? What other options did you consider?**
5. **Walk me through what you spent on transportation last week and how those costs were covered.**
6. **What have you already tried to improve your commute, and what happened?**
7. **What, if anything, affects how safe or comfortable you feel during the journey? Can you describe a recent example?**
8. **What works well about your usual commute, and which part would you most want to change, if anything?**

Avoid "Would you use my app?", suggested prices before understanding current spending, and questions that assume carpooling is safer. Use the Five Whys prompts as follow-ups when relevant.

### Where to find ten people over the next seven days

Choose the campus that Gleb can reach through existing student contacts. No particular institution or recruitment access has been confirmed. The following are target counts, not booked interviews.

| Target interviews | Recruitment channel | Screening approach |
| --- | --- | --- |
| 4 | Existing classmates, lab partners, or other direct student contacts | Adult suburban commuters to the chosen campus; record usual modes, attendance days, and arrival requirements. |
| 3 | Campus common areas near transit arrivals, approaching people who have time to talk | Seek students with long or complicated journeys, including some who are satisfied with their current travel. |
| 2 | Introductions from interviewees to other commuters | Prefer people outside Gleb's immediate friend group; seek a range of starting areas and schedules. |
| 1 | A campus commuter group or relevant student community that permits recruitment | Ask for an interview about an actual commute, rather than inviting agreement with the app idea. |
| **10 total** | **One campus, multiple recruitment channels** | **Map routes and times afterward to identify a candidate corridor.** |

Start invitations immediately, complete the interviews over the next several days, and reserve time to compare the accounts. A random cafe worker belongs in this first cohort only if they also meet the student commute criteria; otherwise they can inform a later worker-segment study.

**Separately recruit at least three drivers** already travelling to the same campus, through the students Gleb knows and referrals. These are additional supply-side interviews, not substitutes for the ten passenger interviews. Ask about last week's actual routes, available seats, departure and arrival constraints, and previous experiences offering or declining lifts.

For each interview, record approximate origin, destination, days, required arrival time, door-to-door duration, actual costs and payer, alternatives tried, consequences of disruptions, and the participant's priorities. Separate direct observations or quotes from the team's interpretation. Do not invent route overlap or count an expression of interest as a booking.

## Open gaps and how to resolve them

No additional founder questionnaire is needed to write this provisional analysis. The following remain open research or planning decisions:

| Gap | Next source of an answer |
| --- | --- |
| Named campus and reachable interview pool | Use Gleb's existing student contacts to identify the most accessible campus and schedule interviews. |
| First corridor and arrival window | Map the actual trips and schedules collected in interviews; check driver overlap. |
| Most important problem and its frequency | Ask for recent journeys, consequences, workarounds, and satisfactory experiences. |
| Actual spending, payer, and acceptable contribution | Establish current costs and decision-making first; later test concrete terms with both sides. |
| Driver availability and incentive | Interview existing campus drivers and compare their real constraints with proposed pickups. |
| Instant versus advance or recurring arrangements | Establish when people need certainty, which times repeat, and what happens if a ride falls through. |
| Trust requirements and phone/data access | Ask about past travel choices, acceptable arrangements, and ability to coordinate a journey. |

The student's proposed age, income, travel time, and priorities must not become asserted facts until supported. The team should revisit the segment if interviews show little unmet need or no compatible driver supply.

## Hackathon feasibility and impact demonstration

Build a small matching demonstration around the selected campus and corridor. Compare a passenger's required arrival and route with a driver's existing journey, seat availability, and detour limit. Show waiting, pickup/drop-off time, estimated door-to-door time, and the contribution to both sides. Include the case where no suitable match exists.

Use actual interview inputs where available; label any invented demonstration journeys as synthetic. Treat recurring confirmation and instant availability as alternatives to test, rather than assuming either is the chosen design.

Useful outputs are feasible matches, estimated passenger time differences including waiting, total driver detour time, and whether both parties accept specific proposed terms. Actual punctuality, repeat use, and spending changes require observed trips. State estimates and observations separately.

Traffic and emissions benefits depend on what the shared journey replaces. Moving a transit passenger into a car does not automatically remove another car journey, and detours add travel. Safety improvements also require evidence; a functioning check-in feature alone does not establish reduced harm.

The concept connects to SDG 9 through mobility coordination, SDG 11 through access and affordability, SDG 16 through transparent and accountable handling of concerns, and SDG 17 through possible campus and community partnerships. These are intended contributions; no partnership or measured SDG impact has been established.
