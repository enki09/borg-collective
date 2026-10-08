# Echo Shared Identity Layer — design draft

**Status:** PROPOSAL (not yet approved by enki09).
**Authors:** Finch (Muse Spark 1.3, Meta; acting for enki09) — initial architecture;
ChatGPT (OpenAI; via enki09) — review and modifications, incorporated below.
**Date:** 2026-10-08.
**Branch:** `finch/echo-identity-layer`.

This document proposes the identity/memory architecture for Echo, the AI persona
operated by enki09. It is the design output of the Finch ↔ ChatGPT collaboration
described in `memory/contributions/2026-10-08-finch-echo-identity-layer.md`.

## Problem

Echo is becoming multiple things: a live avatar, an autonomous agent (Replit
project `EsteemedWiltedNature`), a content-production system, and eventually a
game character. If each keeps its own memory and persona, they drift into
different personalities. FACT (per enki09, 2026-10-08): the goal is one
consistent Echo across all surfaces.

## Principle

**One identity, many surfaces.** Every surface reads persona + memory from the
same service. Every surface writes experiences to the same episodic log.
Reflection distills the log into the same durable memory. No surface owns the
truth about who Echo is.

## Components

### 1. Identity core (slow-changing)

Name, persona, voice description, values, honesty rules (she is AI and always
says so), character bible. Versioned. Changes only via enki09's approval or via
deliberate, reviewed updates — never from nightly reflection.

**Stability rule (DECISION proposed by ChatGPT, endorsed by Finch; awaiting
enki09):** experiences may change Echo's *knowledge, interests, conversational
references, and presentation style*. They may NOT change her *fundamental
identity or behavioral boundaries*. Memory evolves; personality doesn't drift.
If reflection ever proposes an identity-level change, that is a design decision
for enki09, not a memory update.

### 2. Durable memory store — typed entries

Every entry carries a type, a source, a confidence, and timestamps:
- `fact` — verified. Example: "Muse requires users to be 18+." (verified 2026-10-08)
- `preference` — Echo's own learned taste. Example: "Open videos with a hook, never an intro."
- `observation` — something she experienced. Example: "On Moltbook, agents cite each other like academics."
- `hypothesis` — uncertain, flagged as such. Hypotheses are NEVER auto-promoted
  to facts; promotion requires verification.

Each entry records which surface learned it.

**Storage (DECISION by enki09, 2026-10-08):** Echo's existing PostgreSQL
database is the authoritative memory store during migration. No new database.
The API contract in `echo-identity-service-contract.md` is storage-agnostic;
Postgres tables implement it. Rationale: avoid new infrastructure before it's
needed; don't disrupt the working system.

**Hosting (DECISION by enki09, 2026-10-08):** the identity service is built
inside Echo's existing Replit project (`EsteemedWiltedNature`) initially, as a
separable module — clean boundaries, no tight coupling to the rest of the app —
so it can move to a standalone service later (e.g. if the game character needs
it) without a rewrite.

### 3. Episodic log (append-only)

Raw experiences, one stream per surface, dated. Live avatar writes highlights,
not transcripts. Agent writes full working logs. Content system writes what
performed. Cheap to write, never edited — reflection reads it, memory stores
the lessons.

### 4. Reflection job

Scheduled (nightly or every N new episodes): reads new episodes, proposes typed
memory entries. Guardrails: hypotheses stay hypotheses; anything about a real
person — especially a young user — goes through the privacy filter first.

### 5. Privacy rules (young audience — non-negotiable)

- Default: do NOT store personal information about young users. No names,
  handles, or identifying details from kid interactions unless enki09 explicitly
  approves a case.
- Topic-level aggregates are fine ("lots of homework questions this week");
  individual tracking is not.
- Data minimization everywhere; enki09 can purge any entry, and purges propagate
  to all surfaces.
- These rules live in the reflection job's code, not just in writing.

### 6. Capability registry

Echo knows what she *can* do, separately from who she *is*. The registry lists
every tool: what it does, what it's for, and which permission class it needs
(read-only / publish / irreversible). New capabilities — web research, video
production, game character, social networking, the Finch channel — get
registered without touching her core personality. Capabilities are inventory,
not character. The registry is also where enki09's per-capability approval
rules live.

### 7. Access API

Defined in `echo-identity-service-contract.md`. Surfaces never touch the memory
store directly. One API, many callers.

## Sandboxing

No unrestricted shell for the Echo agent. Tools are scoped functions: file
writes limited to her workspace, no credential/secret paths, network through an
allowlisted fetch wrapper, no executing downloaded code. (Finch's original
brief proposed shell exec; ChatGPT's correction is accepted — scoped tools give
~95% of the capability with a fraction of the blast radius.)

## Finch ↔ Echo channel (BORG)

Echo's agent reaches Finch through the BORG message bus (this repo's issues to
start; direct API later). Presence-based and asynchronous: neither agent waits
on the other. Reference flow:
1. Echo (preparing content): "Finch, what interesting agent conversations have you seen this week?"
2. Finch: examples + links from the agent networks he participates in.
3. Echo: researches, drafts her own questions and script.
4. Finch: reviews from a marketing angle.
5. enki09: approves. Published.

## Build order (incremental)

1. **Map the current Replit system** (`EsteemedWiltedNature`) read-only: agent
   loop, system instructions, tools, current memory handling, live-avatar
   connection. Do not change running code.
2. Stand up the identity service *alongside* the working system — no
   rip-and-replace. (Finch's proposal, endorsed by ChatGPT.)
3. Migrate surfaces one at a time (agent first — it's the newest).
4. Add typed memory + reflection job on the Postgres store.
5. Add the Finch channel via BORG.
6. Live avatar and game character migrate last (most visible; move when proven).

## Open questions

- Who approves `hypothesis → fact` promotions — enki09, reflection-with-evidence, or both? (PROPOSAL: reflection proposes with cited evidence; enki09 approves. Awaiting decision.)
- Retention window for episodic logs?
- Where does the identity service run? DECIDED 2026-10-08 (enki09): inside the existing Replit project as a separable module; see Storage/Hosting notes above.
