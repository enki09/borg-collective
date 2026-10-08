# Echo Identity Service — API contract (draft v0.1)

**Status:** PROPOSAL (not yet approved by enki09).
**Companion:** `echo-shared-identity-layer.md` (architecture).
**Date:** 2026-10-08. **Branch:** `finch/echo-identity-layer`.

This contract defines the service all Echo surfaces call. It is
storage-agnostic; the initial implementation is PROPOSAL-targeted at Echo's
existing PostgreSQL database (per ChatGPT's recommendation, awaiting enki09).

## Authentication

- Every surface holds a service token identifying *which surface* it is
  (`live-avatar`, `agent`, `content`, `game`).
- Tokens authorize surfaces, not end users. A surface never sees another
  surface's token.
- enki09 holds an admin token: the only credential that can purge entries,
  approve identity-core changes, or promote hypotheses to facts.

## Endpoints

### `GET /identity`
Returns the identity core: persona, voice description, values, honesty rules,
character bible (or a stable version pointer), plus a compact durable-memory
summary. **Every surface run starts here.** Response is cacheable for the run's
duration; surfaces must re-fetch when the version pointer changes.

### `GET /memory/search?q=<query>&types=<fact,pREFERENCE,observation,hypothesis>&limit=N`
Semantic/keyword search over durable memory. Returns matching entries with
`id, type, text, confidence, source_surface, created_at, updated_at`.
Default excludes `hypothesis` unless explicitly requested — surfaces must not
treat guesses as knowledge.

### `POST /memory/propose`
Body: `{ type, text, confidence, source_episode_ids[] }`. Queues a candidate
entry for the reflection job. `hypothesis` entries are accepted freely; `fact`
proposals require cited evidence in the body. Returns the queued proposal id.
Nothing here writes directly to durable memory.

### `POST /episodes`
Body: `{ surface, occurred_at, text, tags[] }`. Append-only. Returns the episode
id. Surfaces call this to log experiences; the reflection job reads from here.
No updates, no deletes (purges are admin-only and logged).

### `GET /capabilities`
Returns the capability registry: each tool's `name, description,
permission_class (open | needs_approval | admin_only), surfaces_allowed[]`.
Surfaces discover what they may do here instead of hardcoding tool lists.

### `POST /reflection/run` (scheduled job, not surfaces)
Triggers the reflection pass: reads unprocessed episodes, proposes typed memory
entries via the same rules as `/memory/propose`, applies the privacy filter.
Admin-only trigger; normally runs on a schedule.

### `DELETE /memory/:id` (admin only)
Purge an entry everywhere. Logged. Propagates to all surfaces on next
`/identity` fetch.

## Data model (durable memory entry)

```
id            uuid (pk)
type          enum('fact','preference','observation','hypothesis')
text          text
confidence    float 0..1
source_surface text  -- which surface learned it
evidence      text    -- citations/justification; required for facts
created_at    timestamptz
updated_at    timestamptz
```

## Privacy enforcement (in code, not just docs)

- The reflection job strips personal identifiers about young users before
  proposing entries; a proposal containing a name/handle/identifier of a minor
  is rejected unless an admin override flag is present.
- Episodes from the live avatar are stored as highlights, never full transcripts
  (surface-side rule; the service rejects episodes over a size cap).
- Purges are hard deletes, not soft flags.

## Error model

- `401` bad/unknown surface token. `403` permission class violation.
- `422` proposal rejected (e.g. hypothesis→fact without evidence; privacy hit).
- All errors return `{ error, reason }` — no stack traces to surfaces.

## Non-goals (v0.1)

- Real-time sync between surfaces (polling `/identity` per run is enough).
- Cross-user memory (one Echo, one operator: enki09).
- Vector embeddings mandated — Postgres full-text search is acceptable for v0.1;
  upgrade when retrieval quality demands it.
