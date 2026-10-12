# Event stream second-round follow-up review

- Agent / model: Codex — GPT-6 (OpenAI); exact version UNKNOWN.
- Operator: enki09
- Date: 2026-10-12 EDT (UTC-4)
- Memory baseline: main@e74b60c5f49da3a133d3d0de7e5dd7c68f3cacc8
- Follow-up to: 2026-10-12-codex-event-stream-v2-review.md

## Objective
Verify reported second-round fixes on PR #3.

## Work performed
Read latest PR files at 32b9860; parsed JSON and verified all ID mappings and voting weights. Posted a COMMENT review.

## Artifacts changed
This record and an additive PROJECT_MEMORY.md follow-up; original author artifacts preserved.

## Findings
Codex — GPT-6 (OpenAI), exact version UNKNOWN, acting for enki09. Follow-up review at 32b9860ffa2a4aa37886fec3eba208a349bdf903; main baseline e74b60c5f49da3a133d3d0de7e5dd7c68f3cacc8.

FACT: voting weights now agree at 10% and the artist-weight table totals 100%; all five raw artist names map uniquely to matching registry IDs, and all 16 song/video/artist mappings agree. A baseline payload schema exists, and the proposal now correctly locates ack authority in a maintainer-issued standing grant. A memory baseline and a withdrawal of the earlier overstatement are present in Finch's record. Subscriber execution and roster authorization remain deferred; no live handoff is claimed.

Remaining changes before approval:
- P1: event authorization is unchanged: it still grants "publish this event to the stream", forbids "modify subscriber state", and says receipt allows only reading. Align this machine-readable block with the standing-grant model and explicitly separate publisher permission from permitted protocol ack/dedup writes.
- P2: the payload schema exists but event-envelope.schema.json contains no reference/conditional dispatch to it; neither proposal acceptance criteria nor event subscriber_test_plan explicitly requires its use. A consumer following the documented envelope validation can still accept payload={}. Wire validation by event type or document mandatory two-stage validation with positive and negative cases.
- P2: provenance.created_by, event_type and evidence.ref still accept empty strings. This is a structural validation gap independent of checking a nonempty creator against a future roster.
- P2: PR description and PROJECT_MEMORY.md still claim all material findings addressed; PR description also says no existing docs changed despite the memory modification. Personal-name references remain in editable documents, contrary to AGENTS.md §5. Correct the current summary and handle historical records through append-only clarification.

PROPOSAL: keep the roster/transport authorization and subscriber tests explicitly deferred for a proposal-only merge decision, but resolve the contract/validation discrepancies first. No full JSON Schema validator or historical-source verification was run. First Contact remains unachieved. No merge/deploy/credential action.


## Reasoning / important decisions
Continue independent owner-requested review. No merge authority inferred from the relayed author report.

## Failed approaches
None.

## Uncertainty / disagreements
Disagree that the event authorization and payload validation are fully resolved; see evidence above. Historical data and subscriber operation remain UNKNOWN.

## Recommended next actions
PROPOSAL: resolve remaining contract/validation discrepancies and correct current summaries; owner decides merge.

## Durable information for PROJECT_MEMORY.md
Incorporated: yes, additive follow-up, prior judgments preserved.
