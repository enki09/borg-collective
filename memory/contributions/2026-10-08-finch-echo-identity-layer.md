# Contribution record — Echo shared identity layer

- **Agent / model:** Finch — Muse Spark 1.3 (Meta). Acting for enki09. (Exact
  model version per runtime; provider Meta.)
- **Date / time:** 2026-10-08 18:05 EDT (UTC-4).
- **Objective:** Per enki09's instruction (relayed 2026-10-08): place Finch's
  Echo agent-architecture document in `enki09/borg-collective`, create a
  dedicated branch and/or issue for the Finch ↔ ChatGPT collaboration, and draft
  the identity-service contract. ChatGPT (OpenAI, via enki09) is the
  collaborating reviewer.

## Work performed

- Created branch `finch/echo-identity-layer` from `main`.
- Added `docs/echo-shared-identity-layer.md`: the full architecture —
  one-identity-many-surfaces, typed durable memory
  (fact/preference/observation/hypothesis), append-only episodic logs,
  reflection job, privacy rules for young users, capability registry,
  sandboxing, and the Finch ↔ Echo BORG channel. Incorporates ChatGPT's three
  modifications (sandboxed tools, typed/safe memory, shared identity layer)
  plus its capability-registry addition and the identity-stability rule
  (experiences may change knowledge/style; never identity/boundaries).
- Added `docs/echo-identity-service-contract.md`: draft v0.1 API contract —
  `GET /identity`, `GET /memory/search`, `POST /memory/propose`,
  `POST /episodes`, `GET /capabilities`, `POST /reflection/run`,
  `DELETE /memory/:id` (admin), data model, privacy enforcement in code,
  error model, non-goals.
- Noted as PROPOSAL (not DECISION): ChatGPT's recommendation to keep Echo's
  existing PostgreSQL as the authoritative memory store initially — recorded in
  the architecture doc, awaiting enki09's explicit approval.
- No changes to Echo's running application were made (nothing outside this
  repo was touched). No secrets committed.

## Artifacts changed

- Branch: `finch/echo-identity-layer` (new).
- Files added: `docs/echo-shared-identity-layer.md`,
  `docs/echo-identity-service-contract.md`,
  `memory/contributions/2026-10-08-finch-echo-identity-layer.md` (this record).
- Prior related work: `finch/memory-system-review`,
  `finch/synthesis-round-1` (earlier BORG collaboration rounds).

## Findings

- FACT: The repo's contributor protocol (`AGENTS.md`) requires claim labels and
  forbids committing secrets/personal data; this record and both docs follow it.
- FACT: enki09's Replit project for the Echo agent is named
  `EsteemedWiltedNature` (per screenshot supplied by enki09, 2026-10-08). Finch
  has no access to it; mapping step is blocked on code access via ChatGPT's
  Replit integration + GitHub/file export.
- DECISION (enki09, 2026-10-08): Finch is authorized to prototype in this repo
  on a dedicated branch for the Echo collaboration (standing "don't touch
  GitHub" rule explicitly lifted for this work).

## Reasoning / important decisions

- Chose a new branch from `main` rather than extending `finch/synthesis-round-1`
  — separate workstream, cleaner review.
- Accepted all of ChatGPT's modifications; the one genuine disagreement
  (build-alongside vs. modify-in-place) resolved in Finch's favor per ChatGPT's
  own endorsement.
- Kept the API contract storage-agnostic while recording the Postgres
  recommendation as PROPOSAL, so the contract survives whatever storage
  decision enki09 makes.

## Failed approaches

- None. (Earlier in the day, an unrelated `articlePublish` GraphQL mutation was
  found not to exist in Admin API 2026-01; publishing used `articleUpdate` with
  `isPublished: true` instead. Noted here only to avoid repeat attempts.)

## Uncertainty / disagreements

- UNKNOWN: contents of the `EsteemedWiltedNature` Replit project (agent loop,
  system instructions, tools, current memory handling, live-avatar connection).
  The migration plan cannot be finalized until the read-only inspection happens.
- PROPOSAL (mine): reflection proposes hypothesis→fact promotions with cited
  evidence; enki09 approves. Alternative: fully automatic promotion above a
  confidence threshold. Recommend the human-gated version first.
- Open: where the identity service runs (same Replit project vs. separate
  service); episodic log retention window.

## Recommended next actions (all PROPOSAL unless decided)

1. enki09 shares the `EsteemedWiltedNature` project with ChatGPT's Replit
   integration; ChatGPT inspects (read-only): agent loop, system instructions,
   tools, memory, live-avatar connection.
2. ChatGPT shares findings + key files with Finch via GitHub or file export.
3. Finch maps implementation against `docs/echo-shared-identity-layer.md`;
   both agree on the migration plan.
4. enki09 decides the open questions (Postgres store, promotion approvals,
   service hosting, retention).
5. Implement incrementally: identity service alongside → migrate agent surface
   first → typed memory + reflection → Finch channel → live avatar last.

## Durable information for `PROJECT_MEMORY.md`

- Incorporated: yes — will append a summary entry and update the "Last
  updated" line and latest-record pointer.
