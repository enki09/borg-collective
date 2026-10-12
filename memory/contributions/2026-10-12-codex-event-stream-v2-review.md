# Independent v2 event stream review

- Agent / model: Codex — GPT-6 (OpenAI); exact version UNKNOWN.
- Operator: enki09
- Date: 2026-10-12 EDT (UTC-4)
- Memory baseline: main@e74b60c5f49da3a133d3d0de7e5dd7c68f3cacc8
- Follow-up to: 2026-10-12-finch-borg-event-stream-pilot.md

## Objective
Review PR #3 against the earlier findings.

## Work performed
Read all eight PR files and commit metadata; checked JSON parsing, evidence resolution, counts and registry/song joins at c6a0ad9. Posted formal COMMENT review 5487367840 with inline findings.

## Artifacts changed
This append-only record and PROJECT_MEMORY.md review addendum; PR #3 review. Original pilot files and records preserved.

## Findings
Reviewer: Codex — GPT-6 (OpenAI), exact version UNKNOWN, acting for enki09.
FACT: reviewed PR #3 at c6a0ad93241c829e7dc11c2afebbcc1c436e3663 against main@e74b60c5f49da3a133d3d0de7e5dd7c68f3cacc8.

**Resolved:** evidence paths now resolve in-repo; snapshot/registry totals agree (5 artists, 16 songs), and all 16 song IDs, artist IDs and video IDs match the registry. schema_version is constrained to "1"; event_id, idempotency_key and publisher reject empty strings. The branch contains only the pilot work and has an Agent trailer; the previous misattribution is absent from this new commit. Whether its author address is maintainer-assigned remains UNKNOWN.

**Remaining findings (PROPOSAL: changes before approval):**
1. **P1: authorization contract remains contradictory.** events/pilot/evt-20261012-001.json:7–12 still forbids modifying subscriber state and permits only reading on receipt. Proposal:74–80 permits an ack ledger, but does not define approved subscription, trusted publisher policy or deduplication writes separate from acknowledgment. Reconcile the event and proposal, and specify that an owner-approved subscription permits only bounded protocol writes; self-asserted event grants must never authorize actions.
2. **P2: schema tightening is partial.** events/schema/v1/event-envelope.schema.json:65 permits empty created_by; event_type and evidence.ref may also be empty, and payload remains any object. Add nonempty provenance/evidence/type requirements and a baseline payload contract (or an explicit separate validator), with negative cases for unsupported version, empty creator and empty payload. Full draft-2020-12 validation was not run; these conclusions follow directly from schema constraints.
3. **P2: baseline data does not implement the documented ID join.** 2026-10-12-raw.json artists have names but no permanent artist IDs, whereas the methodology requires snapshot IDs. Add the registry ID to each artist measurement. The methodology also assigns voting 15% in §3 but 10% in §8; choose one consistent proposed weight before implementing scoring.
4. **P2: governance record and closure claims remain inaccurate.** The Finch contribution record lacks the required main memory baseline (AGENTS.md §8), retains stale PR-permission language, and says all material findings are addressed. PROJECT_MEMORY.md repeats that closure claim. Personal-name references remain in the new docs despite AGENTS.md §5. Add an append-only clarification/baseline and use enki09 in editable documents; mark unresolved findings explicitly.

**Limits:** bundled evidence verifies internal references/joins, not historical source counts or collection authenticity. No live-source verification or executed subscriber/ack/retry results were available. First Contact remains unachieved. Deferred subscriber implementation is reasonable for a proposal PR, but the failure plan should include crash before ack, concurrent duplicates, same key with changed payload, spoofed grants and denied side effects before implementation is accepted.

**Recommendation:** v2 resolves important parts of v1 but is not yet ready for approval. No merge, deployment, credential change or unrelated PR closure was performed. The initial 403 was resolved after installing the connector for enki09/borg-collective; it did not indicate a repository ban on PRs.

## Reasoning / important decisions
Owner requested continuation of the formal review. COMMENT records the assessment without asserting approval. No fixes to the author's artifacts were made.

## Failed approaches
None in this review.

## Uncertainty / disagreements
Disagree with the author claim that all material findings are fixed; remaining findings are above. Owner decides. Historical source authenticity and subscriber execution UNKNOWN.

## Recommended next actions
PROPOSAL: resolve remaining findings before approval, and verify subscriber behavior before First Contact.

## Durable information for PROJECT_MEMORY.md
Incorporated: yes, additive review/Contested section. Prior judgments preserved.
