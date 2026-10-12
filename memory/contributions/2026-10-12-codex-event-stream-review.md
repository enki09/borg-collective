# Independent event stream pilot review

- **Agent / model:** Codex — GPT-6 (OpenAI); exact model version UNKNOWN.
- **Operator / human:** enki09
- **Date / time:** 2026-10-12, America/New_York (EDT, UTC-4)
- **Memory baseline:** main@e74b60c5f49da3a133d3d0de7e5dd7c68f3cacc8
- **Follow-up to:** 2026-10-12-finch-borg-event-stream-pilot.md

## Objective
Independently review the authorized branch and open a PR against the default branch for owner review.

## Work performed
Read current main governance, memory, primary spec, all contribution records on main and the reviewed branch, all ten proposed files, branch ancestry and GitHub commit identity. Parsed the schema and event JSON and checked required-field presence. Reviewed authorization and subscriber failure coverage.

## Artifacts changed
This append-only review record and PROJECT_MEMORY.md review addendum on finch/borg-event-stream-pilot. Original proposal/schema/event and prior records preserved. PR creation follows this record commit; the PR description contains the same findings.

## Independent review findings

Reviewer: Codex — GPT-6 (OpenAI), acting for enki09. Exact model version: UNKNOWN.
Memory baseline: main@e74b60c5f49da3a133d3d0de7e5dd7c68f3cacc8.
Reviewed original head: 29d29b8e0c86d46b14d81f721331e1140b6cb3cf.

- **FACT / P1 — Evidence cannot be independently retrieved from this PR.** All four provenance references in `events/pilot/evt-20261012-001.json` are relative workspace paths absent from both repository trees. No repository/endpoint base, immutable revision, digest or access contract is supplied. The claimed 16 songs, 5 artists, collection and verified video IDs remain **UNKNOWN** to this reviewer. **PROPOSAL:** provide an authorized, resolvable immutable evidence manifest and verify source records before First Contact acceptance; do not publish private workspace contents wholesale.
- **FACT / P1 — v1 validation does not enforce v1 or meaningful identifiers.** `events/schema/v1/event-envelope.schema.json` permits any string for schema_version, event_id, idempotency_key, publisher and created_by, including empty strings. Event type and payload are unconstrained; a baseline event with an empty payload can pass those rules. **PROPOSAL:** constrain supported versions and nonempty identifiers, define event-specific payload validation, and test unsupported versions, malformed payloads and missing fields. JSON parsing and required-field presence were checked; a full draft-2020-12 validator was unavailable locally, so no validator pass is claimed.
- **FACT / P1 — Authorization scopes conflict and are self-asserted.** The pilot grants event publication while its note says receipt grants only reading; it prohibits modifying subscriber state while the plan requires durable acknowledgment and deduplication state. Provenance creator/publisher/role are unverified strings, not authenticated identity or an owner approval record. **PROPOSAL:** distinguish publisher authorization from subscriber permissions; separately approve narrowly scoped ack/dedup writes; bind publisher identity to trusted transport and owner policy; reject forged grants. No event field may grant publication authority.
- **FACT / P1 — Subscriber test plan is not an executed handoff.** No subscriber, outbox, durable ack artifact, restart test or execution results exist in this tree. Replit access is explicitly UNKNOWN in the contribution record. The duplicate/offline/bad-reference tests are useful but omit crash between apply/ack, concurrent duplicate delivery, same key with altered payload, spoofed identity/grants, unsupported versions and denial of unauthorized side effects. **PROPOSAL:** specify expected durable state and side-effect counts, run the tests against the real subscriber, and keep First Contact unachieved until evidence exists.
- **FACT / P1 — Current governance and commit identity were missed.** Main's AGENTS.md §§1–2, 6, 8 include the 2026-10-04 decisions, absent from the branch copies. All four original branch commits lack the required Agent trailer. Two pilot commits (110f44d, 29d29b8) use the forbidden login-form noreply identity; GitHub maps them to the unrelated account `finch` (id 24537670). The Finch records omit required main memory baselines. The branch still says PRs require explicit authorization, despite main's decision permitting agents' own PRs; this owner's explicit authorization covers opening this particular PR. **PROPOSAL:** reconcile current governance, correct stale factual memory, and resolve attribution with the owner before merge; do not rewrite history automatically.
- **FACT / P2 — PR scope includes unmerged Echo work.** Original branch is four commits ahead and two behind main, based on dd3d265 through finch/echo-identity-layer. Ten changed files include Echo architecture/API and GitHub-access guidance, beyond the event pilot. PROJECT_MEMORY.md has concurrent changes on main. **PROPOSAL:** split or explicitly accept the broader scope, reconcile memory while preserving main's decisions and recorded judgments; mergeability must be checked by GitHub.
- **FACT / P2 — Spec integration and approval provenance remain incomplete.** The event envelope differs from the primary borg_spec.json message envelope; no adapter or statement of separate protocol scope is defined. Existing spec requires human-controlled broadcast in current phases and local storage/privacy by default; automated Replit routing needs an explicit opt-in boundary. Proposal labels provenance/authorization "approved" without identifying an owner approval source there, and Echo architecture calls a pending rule a "DECISION proposed". **PROPOSAL:** keep these as proposals unless owner evidence is recorded, document the protocol boundary and opt-in routing.
- **FACT / P2 — Personal-name references violate AGENTS.md §5.** Proposal, memory and inherited Echo records refer to the maintainer by a personal name rather than handle. **PROPOSAL:** use enki09 in editable docs; handle historical append-only records through an owner-approved correction/redaction approach.

**Assessment / PROPOSAL:** retain as a draft for owner review; do not merge or operate the stream until P1 findings are resolved. The architecture correctly distinguishes receipt from trust and publication authority, references from payloads, and event ID from idempotency key; the current artifact does not yet implement or verify these guarantees.


## Reasoning / important decisions
DECISION: owner explicitly authorized this branch review and PR opening in the current Codex request. No merge, deploy, credential changes, external service implementation or history rewriting. The review record and memory addendum fulfill current AGENTS.md §8.

## Failed approaches
GitHub fetch rejected encoded branch and compare endpoints; compare_commits and commits/tree reads provided the evidence. Default Python was unavailable; bundled Python lacked jsonschema. No full validator result is claimed. Initial create-tree and PR requests returned HTTP 403; the owner installed the connector for this repository and explicitly requested a retry.

## Uncertainty / disagreements
UNKNOWN: evidence authenticity and reachability, actual subscriber permissions/access and execution, underlying approval transcripts, assigned agent author addresses. Disagree with "real verified" acceptance implications until retrievable evidence and subscriber results exist. Prior agent judgments preserved.

## Recommended next actions
PROPOSAL: owner resolves the P1 findings and scope/governance issues before merge or subscriber operation.

## Durable information for PROJECT_MEMORY.md
Incorporated: yes, as an additive review and contested-findings section. Existing judgments/history were not overwritten.
