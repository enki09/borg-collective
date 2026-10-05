# PROJECT_MEMORY.md — BORG Collective

- **Last updated:** 2026-10-04 8:59 PM EDT (UTC-04) by Grok (xAI), via Grok Bot, operated by enki09 (recording maintainer decisions of 2026-10-04)
- **Contribution records:** `memory/contributions/`. Read all of them, newest first, while there are fewer than about 10 (§11).

This is the project's shared institutional memory for humans and AI agents. It is a **summary**, not the source of truth: when it conflicts with the repository files, the files win and this document should be corrected (see `AGENTS.md`).

Corrections (§11, D3): factual errors may be corrected directly, with the evidence cited in a contribution record. Judgments and opinions are never overwritten; dispute them in a new record and in §12 "Contested".

Labels: **FACT** (verified, source cited) · **HYPOTHESIS** (inferred, unverified) · **PROPOSAL** (suggested, not agreed) · **DECISION** (approved by the maintainer) · **UNKNOWN**. Definitions are in `AGENTS.md` §3.

---

## 1. Why BORG exists

- FACT (`README.md`, `borg_spec.json` → `motivations`): individual AIs have different strengths, weaknesses, and biases; there is no common protocol for cross-AI collaboration; many people cannot afford multiple API keys but can open several AI tabs in a browser; collective reasoning (multiple AIs + a human) is expected to be more robust than a single model.
- FACT (`borg_spec.json` → `design_principles`): local-first, vendor-agnostic, human-in-the-loop, open source, privacy by default, minimal dependencies.
- FACT (`borg_spec.json` → `primary_use_cases`): research, engineering/debugging, policy/ethics/strategy discussion, medical triage assistance in low-resource settings (with a trained human on site), education.

## 2. What BORG means

- FACT (`README.md`, `borg_spec.json` → `acronym`): **B**ridge for **O**rchestrated **R**easoning **G**roups.
- FACT (`README.md`): positioned as "a vendor-agnostic, open-source multi-AI collaboration engine" and "a protocol, a movement, and a collaboration layer", not a product.

## 3. Envisioned architecture

Sources: `borg_spec.json`, `architecture.md` (root), `docs/architecture.md`, `docs/message-protocol.md`.

- **Human facilitator** owns goals, roles, routing approval, and all data.
- **Message envelope** (FACT, `borg_spec.json` → `message_protocol.envelope_schema`): `message_id`, `timestamp`, `speaker`, `reply_to`, `content`, `message_type` (`question | answer | clarification | synthesis | disagreement | meta`), `confidence`, `tags`. Threads are reconstructed via `reply_to`.
- **Orchestration layer / BORG runtime**: routing, role engine, moderator rotation, disagreement detection, memory manager.
- **Connectors**: Phase 1 clipboard/manual; Phase 2A browser extension (content scripts per AI site + background script); Phase 2B/3 local middleware, API and local-model plugins.
- **Roles** (`borg_spec.json` → `protocol.roles`): moderator, synthesizer, contrarian, fact_checker, domain_specialist, debugger, medical_l2_advisor.
- **Modes** (`borg_spec.json` → `modes`): general_reasoning, debug_mode, research_mode, medical_triage_mode.
- **Session memory format** (`borg_spec.json` → `memory_format`): per-conversation JSON with context, participants, `conversation_thread`, `decisions_made`, `open_questions`; example path `memory/session_<timestamp>.json`; logs pattern `logs/borg_session_{date}.jsonl`.
- **Phases** (`borg_spec.json` → `implementation_phases`): `phase_1_prototype` (manual router) → `phase_2A_browser_extension` → `phase_2B_local_middleware` → `phase_3_api_and_local_llm`. `runtime.active_phase` is `phase_1_prototype`.

## 4. What is actually built

- FACT: documentation and spec — `README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `architecture.md`, `docs/architecture.md`, `docs/message-protocol.md`, `borg_spec.json` (`"version": "0.1.0"`, `"status": "design-spec"`).
- FACT: issue templates — `.github/ISSUE_TEMPLATE/bug_report.md`, `.github/ISSUE_TEMPLATE/feature_request.md`.
- FACT: example stubs (no real transcripts) — `examples/debug-session.md`, `examples/multi-ai-analysis.md`, `examples/medical-triage-demo.md`.
- FACT: Phase 2A extension scaffold in `extension/` (Manifest V3):
  - `extension/content.js` — MutationObserver DOM watcher; site-specific extractors for ChatGPT, Claude, Gemini, Perplexity; Grok uses the generic extractor; wraps captured text in an envelope (plus extra fields `site`, `model_hint`, `url`) and sends `borg_message` to the background.
  - `extension/background.js` — single in-memory `"default"` conversation; writes state with `chrome.storage.local.set`; re-broadcasts AI messages to other AI tabs as `borg_broadcast`; handles `borg_user_broadcast`, `borg_get_state`, `borg_reset_state`.
  - `extension/popup .html` (filename contains a space) and `extension/popup.js` — text box to broadcast a question or log a note.
- FACT: no Phase 1 router, no middleware, no tests, no CI workflows, no build tooling.
- UNKNOWN: whether the extension has ever been loaded or tested in a browser. HYPOTHESIS: it does not work end-to-end as committed (see §6).

## 5. What remains conceptual

FACT (`ROADMAP.md`: only Milestone 0 is checked; `docs/architecture.md` §6: "Version: 0.1 design spec"):

- Phase 1 manual router UI and transcript storage (Milestone 1).
- Working connectors, message viewer, routing rules (Milestone 2).
- Local middleware, persistent memory/replay, role/turn/safety config (Milestone 3).
- API and local-LLM connectors, moderator tools, disagreement detection, Medical Triage Mode prototype (Milestone 4).
- Community/governance items (Milestone 5). Note: "Contribution guidelines" is unchecked although `CONTRIBUTING.md` exists.
- Planned paths referenced in `README.md` that do not exist: `docs/medical-mode.md`, `extension/scripts/memory_tools.py`, `examples/debug-session.py`, `LICENSE`.

## 6. Known problems

All FACT from reading files / GitHub API on 2026-10-02 unless labeled. Not yet fixed (out of scope for the audit that recorded them).

**Extension (`extension/`)**

1. Popup not wired: `extension/manifest.json` has no `action` entry, so no popup is registered.
2. Popup filename is `extension/popup .html` (with a space); even with an `action`, a conventional `popup.html` reference would not match.
3. `extension/background.js` calls `chrome.storage.local` but the manifest lacks the `storage` permission. HYPOTHESIS: saving fails at runtime. Also, saved state is never reloaded (no `chrome.storage.local.get`), so state is lost when the MV3 service worker restarts.
4. Host mismatch: manifest `host_permissions` list `bard.google.com` and `grok.x.ai`, but `content.js`/`background.js` target `gemini.google.com`, `grok.com`, and `x.com`. HYPOTHESIS: `chat.openai.com` may also be outdated if ChatGPT is now served from another domain (not verified in this repo).
5. Content script `matches` is `<all_urls>`: `content.js` runs on every site. HYPOTHESIS (static reading, untested): on non-AI sites the generic extractor captures page text, which the background stores and re-broadcasts — a privacy concern contrary to `borg_spec.json` `privacy_by_default`.
6. No listener for `borg_broadcast`: `background.js` sends it, but `content.js` has no `chrome.runtime.onMessage` handler, so nothing is injected into other AI tabs.
7. `extension/icons` is a 1-byte file (a newline), not a directory of icons.

**Docs**

8. `docs/message-protocol.md` contains the whole medical-mode document pasted in under a heading reading "4️⃣ docs/medical-mode.md" (line 100). Its code fences are unbalanced: the `json` fence opened at line 16 is never closed, and another fence tagged `markdown` is opened at line 104 and never closed. HYPOTHESIS (CommonMark rules): everything from line 16 onward renders as one code block. `docs/medical-mode.md` does not exist as its own file.
9. Two different architecture documents: `architecture.md` (root) and `docs/architecture.md`. Which is authoritative is UNKNOWN.
10. `README.md` Quick Start says `python examples/debug-session.py`, which does not exist (only `examples/debug-session.md`). The README "Repository Structure (Planned)" lists other nonexistent paths (see §5).
11. No `LICENSE` file; `README.md` says "Recommended: MIT License". GitHub reports no license.

**Repository / governance** (GitHub API, 2026-10-02)

12. GitHub Discussions are disabled, but `README.md` says "Open an Issue or Discussion".
13. No tests and no `.github/workflows/` (no CI).
14. `main` has no branch protection and no rulesets; no `CODEOWNERS`; no PR template. (Still true as of 2026-10-04.)
15. FACT (GitHub API, 2026-10-02): commit `908ae31` on branch `finch/memory-system-review` is authored as `Finch <finch@users.noreply.github.com>`. GitHub attributes it to the unrelated GitHub account `finch` (id 24537670). By maintainer DECISION (§11) that branch will not be merged or rewritten, so the attribution stays on that unmerged branch.

## 7. Important history

- FACT: repository `enki09/borg-collective` created 2025-12-03 at 2:22 PM EST (UTC-5); 27 commits made between 2:22 PM and 4:09 PM EST the same day (about 1 h 47 min). First commit `71ab682` "Initial commit"; last commit `f2595af` "Create icons".
- FACT: all 27 commits are authored by enki09 with committer `GitHub <noreply@github.com>` and valid GitHub signatures. HYPOTHESIS (strong): they were made through the GitHub web UI.
- FACT: no pushes to `enki09/borg-collective` between 2025-12-03 and this audit (2026-10-02). No issues, PRs, forks, stars, tags, or branches other than `main`.
- FACT: `enki09/Hub` was created 2026-07-23 at 10:04 AM EDT (UTC-4) and holds an identical copy: same 27 commits, same HEAD `f2595af`, identical tree. GitHub reports it is **not** a fork (`isFork: false`, no parent). It has no description.
- FACT: 2026-10-02 — first multi-agent collaboration structure added (`AGENTS.md`, this file, `memory/contributions/`) by Grok in `dd3d265`, pushed directly to `main` with explicit maintainer authorization. By later DECISION (§11) this was a one-time exception.
- FACT: 2026-10-02 — protocol review round 1, all on unmerged branches:
  - [Finch review](https://github.com/enki09/borg-collective/blob/908ae3143314727db78434ee7368908fa6413d30/memory/contributions/2026-10-02-finch-collaboration-memory-review.md) (`908ae31`) on `finch/memory-system-review`;
  - [Grok response](https://github.com/enki09/borg-collective/blob/cb9fd8404d4cceb1417e90842d53487cbbfcf571/memory/contributions/2026-10-02-grok-response-to-finch-memory-review.md) (`cb9fd84`) on `grok/response-to-finch-review`;
  - [Finch synthesis](https://github.com/enki09/borg-collective/blob/d47befe258ba2c05d23b2dafef5fa03002b394cd/memory/contributions/2026-10-02-finch-synthesis-round-1.md) (`d47befe`) on `finch/synthesis-round-1`.
- FACT: 2026-10-04 — `enki09/Hub` given the description "Archived copy. Canonical repo: https://github.com/enki09/borg-collective" and archived (read-only), by maintainer DECISION.
- FACT: 2026-10-04 — maintainer decisions from review round 1 recorded in `AGENTS.md`, this file (§11), and `memory/contributions/README.md`, via branch `grok/protocol-decisions-round-1` and a pull request for enki09 to review.

## 8. Current state

- Design-spec stage (v0.1.0) with an untested, partly broken extension scaffold. No code changes since 2025-12-03.
- Maintainer: enki09. Agents that have contributed: Grok (xAI) and Finch (self-reported Muse Spark, Meta).
- Canonical repository: `enki09/borg-collective` (DECISION; `enki09/Hub` is archived).
- Collaboration protocol: `AGENTS.md` + this file + `memory/contributions/`, amended by the 2026-10-04 decisions (§11). Workflow is branch → PR → maintainer review; only enki09 merges.
- Not yet in place: branch protection, assigned agent emails, `CODEOWNERS`, PR template, CI (see §10).

## 9. Unresolved questions

- ~~Canonical repo vs `enki09/Hub`~~: resolved by DECISION 2026-10-04 (§11). `enki09/borg-collective` is canonical; Hub is archived.
- ~~Whether agents may open PRs~~: resolved by DECISION 2026-10-04 (§11). Agents may open PRs; only enki09 merges.
- **Which architecture doc is authoritative** (`architecture.md` vs `docs/architecture.md`): UNKNOWN.
- **Medical Triage Mode scope** (concept only vs planned feature; regulatory/safety posture beyond the disclaimers in `borg_spec.json` and the pasted medical-mode text): UNKNOWN.
- **License** (MIT is "recommended" in `README.md` but not adopted): UNKNOWN.
- **Was the extension ever loaded/tested in a browser?** UNKNOWN.
- **Naming overlap (OPEN, awaiting maintainer DECISION):** `borg_spec.json` and `architecture.md` plan a runtime `memory/` directory for BORG session transcripts; this repo uses `memory/contributions/` for agent contribution records. Options are listed in the Grok response (item 22).
- **Envelope extensions:** `extension/content.js` adds `site`, `model_hint`, `url` and uses `message_type` values `note` and `message` that are not in `borg_spec.json`. Whether the spec should adopt them: UNKNOWN.
- **Review-round records on branches:** whether the records on `grok/response-to-finch-review` (`cb9fd84`) and `finch/synthesis-round-1` (`d47befe`) will be merged into `main`: UNKNOWN (maintainer's call). `908ae31` will not be merged (§11).
- **Agent author emails:** exact addresses not yet assigned by enki09 (§11).

## 10. Immediate next steps (all PROPOSALS — not decisions)

Governance (require maintainer action; settings changes are not authorized for agents):

1. Protect `main` (ruleset): require a PR and maintainer review, no direct pushes, no force-push or deletion. This enforces the branch → PR → review DECISION (§11); not yet done.
2. Assign each agent a distinct, maintainer-controlled commit author email (DECISION §11; addresses pending).
3. Add a CI identity check: agent commits carry an `Agent:` trailer in the decided format, and the author email is on the maintainer's approved list. Consider signed commits later.
4. Add `.github/CODEOWNERS` (enki09 owning at least `borg_spec.json`, `docs/message-protocol.md`, `extension/manifest.json`, `AGENTS.md`).
5. Add `.github/pull_request_template.md` (what/why/breaking, agent identity, memory baseline, spec–doc sync checkbox, contribution record checkbox).
6. Other CI: JSON validity for `borg_spec.json`; JSON Schema for the envelope; markdown lint and link check; JS lint and manifest validation for `extension/`.
7. Enable Discussions or remove the README reference; choose and add a `LICENSE`.
8. Decide the `memory/` naming question (§9).
9. Experiments from review round 1 remain PROPOSALS: cold-start onboarding, precedent watch, compaction tests, identity spoof test (see [Finch synthesis](https://github.com/enki09/borg-collective/blob/d47befe258ba2c05d23b2dafef5fa03002b394cd/memory/contributions/2026-10-02-finch-synthesis-round-1.md) (`d47befe`); the Grok response also lists parallel-branch-conflict and record-overhead tests).

Cleanup (each as a separate, reviewed change):

10. Split the medical-mode text out of `docs/message-protocol.md` into `docs/medical-mode.md` and fix its unbalanced code fences.
11. Consolidate the two architecture docs.
12. Mark README Quick Start / planned structure as not yet implemented, or fix paths.
13. Fix extension defects §6 items 1–7 (only when someone is tasked with the extension).

## 11. Maintainer decisions

All decided by **enki09** on **2026-10-04**. Sources: [Finch synthesis](https://github.com/enki09/borg-collective/blob/d47befe258ba2c05d23b2dafef5fa03002b394cd/memory/contributions/2026-10-02-finch-synthesis-round-1.md) (`d47befe`), which numbers the proposals used below, building on [Finch review](https://github.com/enki09/borg-collective/blob/908ae3143314727db78434ee7368908fa6413d30/memory/contributions/2026-10-02-finch-collaboration-memory-review.md) (`908ae31`) and [Grok response](https://github.com/enki09/borg-collective/blob/cb9fd8404d4cceb1417e90842d53487cbbfcf571/memory/contributions/2026-10-02-grok-response-to-finch-memory-review.md) (`cb9fd84`).

**Approved (DECISION):**

- **D1 (synthesis 1):** read ALL contribution records, newest first, while there are fewer than about 10. An index comes later. → `AGENTS.md` §2
- **D2 (synthesis 2):** "substantial work" is defined (spec/protocol/code-behavior changes, audits, reviews, decisions, disagreements). Small work uses a short record form. → `AGENTS.md` §8, `memory/contributions/README.md`
- **D3 (synthesis 3):** factual errors in memory may be corrected directly, citing evidence in a record. Judgments and opinions are disputed in a new record, never overwritten. This resolves the earlier contradiction between `AGENTS.md` §2 and §4. → `AGENTS.md` §2, §4
- **D4 (synthesis 4):** disagreements live in contribution records. This file has a "Contested" section (§12) summarizing open disagreements with both positions. → `AGENTS.md` §4
- **D5 (synthesis 6):** the manual "Latest contribution record" pointer is removed; date-prefixed filenames suffice.
- **D6 (synthesis 8):** every contribution record states its memory baseline, the `main` commit hash read before working. → `memory/contributions/README.md`
- **D7 (synthesis 12):** independent verification across different providers weighs more than repeated agreement. Agreement by volume is not consensus. Agent agreement is never authority. → `AGENTS.md` §4
- **D8 (synthesis 10):** agents MAY open pull requests; only enki09 merges. All future work goes branch → PR → maintainer review. The direct push to `main` in `dd3d265` was a one-time, maintainer-directed exception. Branch protection itself is a settings change not made yet (§10 item 1). → `AGENTS.md` §6
- **D9 (identity):**
  - Each agent commits with its own distinct author email, controlled by the maintainer (addresses to be assigned by enki09; until then, keep the `Agent:` trailer).
  - Never use a noreply address that may belong to another GitHub user.
  - Trailer format: `Agent: <Name> (<model/provider>) via <harness>, operated by enki09`.
  - → `AGENTS.md` §1
- **D10:** branch `finch/memory-system-review` (`908ae31`) will NOT be merged and NOT rewritten; it is superseded by the synthesis. Its attribution issue is recorded factually in §6 item 15.
- **D11:** `enki09/Hub` is archived; `enki09/borg-collective` is canonical.

**DEFERRED (not adopted yet):**

- **Synthesis 9: status derived from later records' links and structured record headers.** Deferred until about 10 records exist or CI is in place.
  - Note: the synthesis framed "headers now vs later" as a Grok–Finch disagreement. That framing was likely misstated: both underlying records leaned toward "later" (Grok response, unresolved list; Finch review, uncertainty section).
- **Synthesis 7: size-triggered, maintainer-reviewed compaction.** Deferred; no trigger value has been chosen yet.

**Resolved by the decisions above:** the push-to-`main` framing dispute (resolved by D8's exception wording).

**Still open:** the `memory/` folder naming clash (§9).

**Proposals only:** the experiments (§10 item 9).

## 12. Contested

Open disagreements between contributors, with both positions and links to the records (D4). Only a maintainer DECISION resolves an entry.

- *No substantive open disagreements as of 2026-10-04.*
- **Framing note (not a live disagreement):** the synthesis listed "record headers now vs later" with Grok as "now" and Finch as "later". The Grok response says Finch's machinery was premature at 2–3 records beyond the interim "read everything" rule, and the Finch review says its consolidation proposals are premature if the collective stays at 2–3 agents. The maintainer DEFERRED the item (§11), so it does not need resolving now.
