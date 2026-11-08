# Routemate: what-if scenarios

_Created: 2026-11-07_

**Purpose:** Discuss what could go wrong with rides arranged beforehand, preferably with the same driver on recurring routes and days.

These are hypothetical scenarios, not incidents reported in the customer interviews. They are questions for the team to work through, not implemented features or guarantees. Use [approach.md](approach.md) for the team's agreed product approach and [real-interviews.md](real-interviews.md) for the actual interview evidence.

## Violence and safety

- **V1:** What if the driver or passenger threatens the other person?
    Before: Ban threats and harassment. Allow cancellation before pickup. Require a cabin dashcam to support incident reviews.
    During: Provide a Get help screen with a Call 911 option, vehicle details, and location.
    After: Allow reporting and blocking, preventing future rides together.
    Support: Assign someone to review reports. Only promise response times the team can deliver.
- **V2:** What if the driver refuses to let the passenger out?
    The driver must stop at the nearest safe, permitted location when asked. Safety-related cancellations carry no penalty. Refusing to release a passenger is an emergency. Block future pairings, urgently review the report, and preserve relevant records.
- **V3:** What if a different person arrives instead of the agreed driver?
    Show the driver’s photo, name, vehicle details, and licence plate before pickup. If anything differs, the passenger can decline the ride and cancel immediately. Ask which detail differs; photos are optional and should only be taken when safe. Review disputed charges using booking records and both accounts. Confirmed mismatches carry no cancellation fee. Proven deliberate false reports may lead to charges or account restrictions. Lack of proof alone does not establish fraud.

## Theft

- **T1:** What if a passenger steals something from the driver's car?
- **T2:** What if a driver leaves with the passenger's belongings?
- **T3:** What if someone reports a theft and the two people give different accounts?

## Privacy

- **P1:** What if someone learns your home address before you agree to ride together?
- **P2:** What if someone uses your recurring schedule to learn when you're away from home?
- **P3:** What if you block someone but they can still see your future trips?
- **P4:** What if your location stays visible after the ride ends?

## Traffic

- **TR1:** What if traffic means the passenger will miss their shift or class?
- **TR2:** What if picking someone up adds much more time than the driver agreed to?
- **TR3:** What if a road closure forces the driver away from the agreed route?
- **TR4:** What if the driver speeds or drives dangerously to avoid arriving late?

## Recurring rides and cancellations

- **R1:** What if the driver cancels at 5:15 a.m. when pickup is at 5:30?
    Notify affected passengers immediately and search for an available backup. Record late cancellations and review repeated patterns, allowing for genuine emergencies.
- **R2:** What if a passenger repeatedly arrives late for pickup?
    Agree on a waiting limit beforehand—for example, five minutes. The driver can leave afterward. Repeated lateness can lead to a warning and ending the arrangement.
- **R3:** What if someone stops wanting to ride with their regular partner?
    Either person can end future rides and request a new match. Encourage advance notice where possible. Safety-related blocking takes effect immediately.
- **R4:** What if there's a ride to work but no ride home?
    Show outbound and return rides separately. Clearly label one-way arrangements so passengers can plan their return before committing.
- **R5:** What if the app promises a backup, but no other driver is available?
    Promise to search for a backup, not guarantee one. Only mark it confirmed when a replacement accepts. If none is available, tell the passenger promptly and show alternative travel options with any additional costs clearly stated.

## How to work through each question

For each scenario, answer:

1. **Before:** How could we reduce the chance of it happening?
2. **During:** What can the app actually do when it happens, including when someone cannot use their phone?
3. **After:** What happens afterward, and who handles the follow-up?

Consider both the driver and passenger. Record the limits of any proposed response. Tracking, reporting, or a backup request does not by itself establish that help or another driver will be available.

### Team answer template

Copy this template for each scenario as the team makes decisions:

| Field | Team answer |
| --- | --- |
| Scenario ID | |
| How could we reduce the risk? | |
| What can the app actually do when it happens? | |
| What happens afterward? | |
| What can we demonstrate in the prototype? | |
| What remains unresolved? | |

**Current status:** The scenarios above are open discussion questions. No answers, safeguards, or build changes have been agreed through this document yet.
