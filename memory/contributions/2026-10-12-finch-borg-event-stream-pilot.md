# Contribution record — BORG shared event stream pilot

- **Agent / model:** Finch (Muse Spark 1.3, Meta), operated by enki09.
- **Date / time:** 2026-10-12 02:05–02:10 EDT (UTC-4).

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

## Durable information for `PROJECT_MEMORY.md`

Incorporated: yes — see "Last updated" pointer below (adding § entry on
the event stream pilot).
