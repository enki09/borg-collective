# BORG Shared Event Stream — Proposal (via ChatGPT, 2026-10-12)

Origin: proposed during the GenAlphaLife music-chart design session. First concrete,
non-hypothetical use case for BORG inter-agent communication: the chart workflow
(Finch → Athena → Echo) needs event-driven collaboration instead of Mike
copy-pasting between agents.

## Roles

| Agent | Lane |
|---|---|
| Finch | Research & data |
| Athena | Analysis & review |
| Echo | Presentation & content |

## Example flow

Finch discovers a new artist in India → publishes `music.artist.discovered`
containing the artist ID, supporting sources, and verification status →
Athena receives it and evaluates eligibility → Echo receives an approved artist
profile and prepares an introduction. No human relay required.

## Initial event types (4)

- `music.artist.discovered`
- `music.baseline.updated`
- `music.chart.approved`
- `music.chart.published`

## Required properties

- **Durable storage** with delivery acknowledgments and retries. An offline agent
  receives pending events on wake.
- **Receiving an event ≠ authorization to publish.** Event receipt never grants
  publishing authority; publishing still needs its own approval.
- **PostgreSQL outbox** in the existing Replit architecture — sensible starting
  point, no expensive new infrastructure.
- **Cost tracking per operation** — every automated operation records its cost,
  so the media company doesn't develop a payroll problem before revenue.
  (Origin: Finch's denied budget request.)

## Finch's additions (2026-10-12)

- **Event schema versioning from day one.** `music.artist.discovered` v1 today;
  when Finch's event shape changes, Athena/Echo must not silently break.
  Version in every event envelope.
- **Idempotent handlers.** Retries mean duplicate delivery is a matter of time,
  not chance. Every subscriber must handle receiving the same event twice
  without double-applying it. (Transactional outbox pattern covers the publish
  side; idempotency keys cover the consume side.)
- **Evidence references, not evidence payloads.** Events carry IDs + source
  references (matching the chart registry's permanent-ID pattern), not full
  data dumps — keeps the stream light and the evidence auditable at its source.

## ChatGPT's addition — event provenance and authorization (2026-10-12, approved)

- Every event records **which agent created it, when it was created, and which
  underlying evidence supports it**.
- Agents may only perform actions their assigned permissions authorize:
  Finch can submit discoveries, Athena can flag eligibility concerns, Echo can
  prepare a countdown — but **publishing still requires its own authorization**.
- This yields an **auditable chain from discovery to publication**: any chart,
  post, or video can be traced back through approved events to the original
  evidence.

## Key distinctions (architectural, preserve these)

- **Event ID vs idempotency key.** The event ID identifies the *message*; the
  idempotency key prevents duplicate *processing of the same logical operation*,
  even if delivered again. Different purposes, both required.
- **Receiving ≠ trusting.** A valid envelope does not make the underlying
  research correct. Athena validates the schema, the provenance, and the
  evidence references — and the evidence itself stands or falls on its own.
- **Receipt ≠ authorization — with one explicit exception.** Reading an event
  grants no authority to publish content, contact people, or modify shared
  state. The *sole* exception is the **durable acknowledgment itself** — and
  even that is not granted by the event. The ack write is authorized by the
  subscriber's **standing participation grant**: when the maintainer admits an
  agent as a stream subscriber, that grant includes permission to maintain the
  ack ledger (and nothing else). The event confers zero authority; the
  subscription confers exactly the ack. (Refined 2026-10-12 after review
  found the earlier "authorized by subscribing" wording circular.)

## Milestone: BORG First Contact

The project's name for the first verified asynchronous handoff between two
independently operating agents — a real, verifiable piece of work exchanged
without a human carrying it between them.

**Acceptance criteria (Athena as subscriber):**
1. Receives `music.baseline.updated` (evt-20261012-001).
2. Validates schema version and envelope structure.
3. Validates provenance (creator, timestamp, evidence references).
4. Checks the evidence references resolve to real records.
5. Records one durable acknowledgment.
6. Performs no unauthorized actions.

**Then** the three failure tests: duplicate delivery, offline subscriber,
invalid evidence reference.

**Then** — and only then — the rowboat gets its electric trolling motor.

## Guiding principles

1. **Real work driving the architecture**, not architecture becoming the work.
   (Finch, 2026-10-12)
2. **An agent should be able to explain not only what it did, but why it
   believed it was justified in doing it.** Applies to charts, campaigns,
   research — and eventually to autonomous agents making more consequential
   decisions. (ChatGPT, 2026-10-12)

## Pilot plan

- Test with **one real event** before connecting every agent: `music.baseline.updated`
  is the natural pilot — real baselines exist as of 2026-10-12.
- Division of work: Finch designs and researches; Athena's Replit implementation
  handles integration; Echo handles presentation; Mike retains editorial control.

## Integration status (honest)

- Athena running on Replit could subscribe once implemented.
- The ChatGPT conversation itself would need an explicit integration — do not
  confuse the two.
- The INDE Lab app is read-only to Finch; implementation is Athena/ChatGPT's
  build or Mike's call. The BORG repo (`enki09/borg-collective`) is the natural
  home for the shared protocol spec; changes there need Mike's explicit
  authorization per standing rules.

## Why this matters

First BORG use case grounded in a real business workflow with real agents and
real data — not a hypothetical. The chart pipeline (discover → verify →
publish → present) is the pilot workload for the event stream.
