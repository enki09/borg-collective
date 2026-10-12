# Contribution record — BORG shared event stream pilot

- **Agent / model:** Finch (Muse Spark 1.3, Meta), operated by enki09.
- **Date / time:** 2026-10-12 02:05–02:10 EDT (UTC-4).
- **Memory baseline:** `main` at `e74b60c` (Merge PR #1, grok protocol decisions).

## Objective

Publish the BORG shared event stream proposal, the first real pilot event
envelope, and the v1 envelope JSON Schema to the repository on a branch,
so ChatGPT (collaborating via GitHub) can review and so Athena's Replit
agent has a concrete subscriber target. Authorized by enki09 ("Yes!" —
2026-10-12 chat) to publish these materials to the repo. Per `AGENTS.md` §6,
did NOT open a PR (needs explicit maintainer authorization); branch push
is the default propose-changes workflow.

## Work performed

- Created branch `finch/borg-event-stream-pilot` from `finch/echo-identity-layer`.
- Added `docs/borg-event-stream-proposal.md` — full proposal: roles
  (Finch research/data, Athena analysis/review, Echo presentation/content),
  4 initial event types, durability/ack/retry, provenance + authorization,
  cost tracking, schema versioning, idempotent handlers, evidence references,
  key distinctions (event ID vs idempotency key; receiving vs trusting;
  receipt vs authorization), "BORG First Contact" milestone + acceptance
  criteria, guiding principles.
- Added `events/pilot/evt-20261012-001.json` — real `music.baseline.updated`
  event for the GenAlphaLife chart week-1 baselines, with provenance,
  evidence refs, idempotency key, authorization boundaries, subscriber
  test plan.
- Added `events/schema/v1/event-envelope.schema.json` — JSON Schema
  (draft 2020-12) for the envelope.
- Read `AGENTS.md`, skimmed `PROJECT_MEMORY.md` and
  `memory/contributions/README.md` before committing (per §2).
- Committed as Finch; pushed branch to origin.

## Artifacts changed

- Branch: `finch/borg-event-stream-pilot` (new).
- Commit: `110f44d` — "BORG event stream: proposal, pilot event, envelope schema v1".
- Files: `docs/borg-event-stream-proposal.md`, `events/pilot/evt-20261012-001.json`,
  `events/schema/v1/event-envelope.schema.json`.
- No PR opened. No changes to `main`.

## Findings

- FACT: The event stream design was co-developed with ChatGPT during the
  GenAlphaLife music-chart session (2026-10-12); the chart pipeline
  (discover → verify → publish → present) is its pilot workload.
- FACT: ChatGPT verified its GitHub connection by retrieving issue #2;
  it can read/review via the repo but does not continuously monitor it.
- DECISION (enki09, 2026-10-12 chat): use GitHub as the immediate
  Finch↔ChatGPT collaboration channel; build the automated event stream
  after.
- PROPOSAL: "BORG First Contact" — first verified async handoff; acceptance
  criteria documented in the proposal.
- UNKNOWN: whether Athena's Replit service can access the repo or another
  shared location to actually consume the pilot event.

## Reasoning / important decisions

- Chose branch-push without PR per `AGENTS.md` §6 (PRs need explicit
  maintainer authorization); enki09's "Yes!" covered publishing the
  materials, not opening the PR.
- Kept the envelope's evidence as references (IDs + paths), not payloads,
  so the event stays light and auditable.
- Added my own three improvements to ChatGPT's proposal (schema versioning,
  idempotent handlers, references-not-payloads); ChatGPT added provenance +
  authorization, which I incorporated.

## Failed approaches

- None.

## Uncertainty / disagreements

- The delivery mechanism for Athena's Replit subscriber is unresolved:
  a file in Finch's workspace is not automatically reachable from Replit.
  The repo is the proposed shared location, but Replit-side access is
  unverified (UNKNOWN).
- ChatGPT (conversation) ≠ Athena (Replit agent): implementation
  coordination must verify the actual connection, not assume it.

## Recommended next actions

- PROPOSAL: enki09 or ChatGPT opens a PR from
  `finch/borg-event-stream-pilot` for review, or explicitly authorizes
  Finch to open it.
- PROPOSAL: Athena's Replit agent implements the subscriber per the
  acceptance criteria and runs the three failure tests.
- PROPOSAL: resolve the shared-location question for Replit (repo pull,
  authenticated endpoint, or explicit delivery).

## Follow-up — second review round (2026-10-12 ~03:00 EDT)

ChatGPT posted a formal review on PR #3. Verified: bundled evidence, matching
counts and song IDs, version restriction, clean scope, commit trailer.
Remaining findings and their dispositions — stated precisely:

1. **Authorization vs acknowledgment** — ADDRESSED by refining the rule: the ack
   write is authorized by the subscriber's standing participation grant
   (maintainer-admitted), not by the event. The event confers zero authority.
2. **Creator identity + payload validation incomplete** — PARTIALLY ADDRESSED:
   added per-event-type payload schema
   (`events/schema/v1/music.baseline.updated.schema.json`). Creator
   authorization against a maintainer agent roster remains a known gap —
   the membership proposal is still pending enki09's decision. Stated as
   UNKNOWN, not solved.
3. **Snapshots lack permanent IDs; voting weights conflict** — FIXED: added
   `events/pilot/evidence/id-mapping.json` (week-1 name-keyed entries linked
   to registry IDs; all future snapshots keyed by ID at collection);
   reconciled voting weight to 10% in both §3 and §8 (Spotify 35%→40% to
   keep the sum at 100%).
4. **Recordkeeping + "all fixed" overstatement** — CORRECTED: my 02:35 reply
   claimed "all fixed" when finding #4 (subscriber tests) was merely
   acknowledged and #3 was a clarification, not a structural fix. The
   overstatement is withdrawn; dispositions above use fixed / addressed /
   acknowledged precisely. Also added the missing memory baseline to this
   record per AGENTS.md §8.

## Earlier pass (2026-10-12 ~02:30 EDT) — superseded by the section above

*Precision note: the "FIXED" labels below overstated closure; the
second-round section gives exact dispositions.*

ChatGPT reviewed the branch (could not open a PR — its GitHub integration
returned 403). Material findings, all addressed on new branch
`finch/borg-event-stream-pilot-v2` (cut from current `main`, so the PR scope
no longer includes the earlier Echo work):

1. **Evidence inaccessible from supplied refs** — FIXED: evidence snapshots,
   registry, and methodology are now bundled under `events/pilot/evidence/`
   and the event's refs are repo-relative.
2. **Schema permits unsupported versions / empty identifiers** — FIXED:
   `schema_version` now has `"enum": ["1"]`; `event_id`,
   `idempotency_key`, and `publisher` have `"minLength": 1`.
3. **Authorization vs durable acknowledgment** — CLARIFIED in the proposal:
   the ack is protocol-level (authorized by subscription itself); all other
   actions still need their own authorization.
4. **Subscriber tests lack execution evidence** — ACKNOWLEDGED: they are
   acceptance criteria awaiting Athena's subscriber, correctly labeled as
   such; not presented as executed.
5. **Governance + commit attribution** — FIXED: discovered `AGENTS.md` on
   `main` was updated (DECISION 2026-10-04) with commit-identity rules I had
   violated (`finch@users.noreply.github.com` is prohibited; required
   `Agent:` trailer missing). All v2 commits use `Finch
   <finch@borg-collective.local>` plus the trailer, consistent with my
   earlier commits. Also discovered the same update explicitly PERMITS agents
   to open PRs from their own branches — so I opened the PR for this branch
   (merge remains maintainer-only).
6. **PR scope included Echo work** — FIXED by cutting v2 from `main`.

## Durable information for `PROJECT_MEMORY.md`

Incorporated: yes — see "Last updated" pointer below (adding § entry on
the event stream pilot).

## Follow-up — third review round (2026-10-12 ~03:10 EDT)

ChatGPT's follow-up review on PR #3. Findings and dispositions:

1. **Event authorization block used old wording** — FIXED: rewrote the
   pilot event's authorization block to match the refined rule (receipt
   confers zero authority; ack authorized solely by the standing
   participation grant). Also fixed the internal contradiction where
   "modify subscriber state" was denied while the ack requires it.
2. **Payload schema not wired into validation** — FIXED: added an
   `allOf` if/then to the envelope schema so known event types must
   validate against their registered payload schema; verified with
   Draft 2020-12 validation (event VALID; negative cases rejected).
3. **Empty creator identity / evidence refs allowed** — FIXED: `minLength: 1`
   on `provenance.created_by` and on evidence `type`/`ref`; negative
   cases verified rejected.
4. **Summaries overstated closure** — CORRECTED: PR #3 description rewritten
   with an honest review-history section naming the remaining known gaps;
   earlier record section demoted with a precision note.

Still deferred (not presented as closed): roster authorization for creator
identity; subscriber execution evidence (awaits Athena's implementation).
