# PROJECT_MEMORY.md — BORG Collective

- **Last updated:** 2026-10-02 7:31 PM EDT (UTC-04) by Grok (xAI), via Grok Bot, operated by enki09
- **Latest contribution record:** [`memory/contributions/2026-10-02-grok-repository-audit-and-collaboration-setup.md`](memory/contributions/2026-10-02-grok-repository-audit-and-collaboration-setup.md)

This is the project's shared institutional memory for humans and AI agents. It is a **summary**, not the source of truth: when it conflicts with the repository files, the files win and this document should be corrected (see `AGENTS.md`).

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
14. `main` has no branch protection and no rulesets; no `CODEOWNERS`; no PR template.

## 7. Important history

- FACT: repository `enki09/borg-collective` created 2025-12-03 at 2:22 PM EST (UTC-5); 27 commits made between 2:22 PM and 4:09 PM EST the same day (about 1 h 47 min). First commit `71ab682` "Initial commit"; last commit `f2595af` "Create icons".
- FACT: all 27 commits are authored by enki09 with committer `GitHub <noreply@github.com>` and valid GitHub signatures. HYPOTHESIS (strong): they were made through the GitHub web UI.
- FACT: no pushes to `enki09/borg-collective` between 2025-12-03 and this audit (2026-10-02). No issues, PRs, forks, stars, tags, or branches other than `main`.
- FACT: `enki09/Hub` was created 2026-07-23 at 10:04 AM EDT (UTC-4) and holds an identical copy: same 27 commits, same HEAD `f2595af`, identical tree. GitHub reports it is **not** a fork (`isFork: false`, no parent). It has no description.
- FACT: 2026-10-02 — first multi-agent collaboration structure added (`AGENTS.md`, this file, `memory/contributions/`) by Grok, pushed directly to `main` with explicit maintainer authorization. See the latest contribution record.

## 8. Current state

- Design-spec stage (v0.1.0) with an untested, partly broken extension scaffold.
- Single maintainer and contributor: enki09.
- Collaboration scaffolding now exists (`AGENTS.md`, `PROJECT_MEMORY.md`, `memory/contributions/`); governance (protection, CODEOWNERS, templates, CI) does not.

## 9. Unresolved questions

- **Canonical repo vs `enki09/Hub`.** HYPOTHESIS/working assumption: `enki09/borg-collective` is canonical (it is the original, has the description, and `README.md` clones from it). Purpose of `Hub`: UNKNOWN. Maintainer has not recorded a DECISION.
- **Which architecture doc is authoritative** (`architecture.md` vs `docs/architecture.md`): UNKNOWN.
- **Medical Triage Mode scope** (concept only vs planned feature; regulatory/safety posture beyond the disclaimers in `borg_spec.json` and the pasted medical-mode text): UNKNOWN.
- **License** (MIT is "recommended" in `README.md` but not adopted): UNKNOWN.
- **Was the extension ever loaded/tested in a browser?** UNKNOWN.
- **Naming overlap:** `borg_spec.json` and `architecture.md` plan a runtime `memory/` directory for BORG session transcripts; this repo now uses `memory/contributions/` for agent contribution records. Whether these should be separated (e.g. a different directory name for one of them): UNKNOWN / open.
- **Envelope extensions:** `extension/content.js` adds `site`, `model_hint`, `url` and uses `message_type` values `note` and `message` that are not in `borg_spec.json`. Whether the spec should adopt them: UNKNOWN.

## 10. Immediate next steps (all PROPOSALS — not decisions)

Governance (require maintainer action):

1. Record a DECISION on the canonical repo; archive `enki09/Hub` or describe it as a mirror.
2. Protect `main` (ruleset): require PRs, code-owner review, passing checks, no force-push/deletion. Future agent work should go through PRs once protection exists.
3. Add `.github/CODEOWNERS` (enki09 owning at least `borg_spec.json`, `docs/message-protocol.md`, `extension/manifest.json`, `AGENTS.md`).
4. Add `.github/pull_request_template.md` (what/why/breaking, agent identity, spec–doc sync checkbox, memory/contribution record checkbox) and a task/handoff issue template.
5. Add CI: JSON validity for `borg_spec.json`; JSON Schema for the envelope; markdown lint + link check; JS lint and manifest validation for `extension/`.
6. Enable Discussions or remove the README reference; choose and add a `LICENSE`.
7. Consider `docs/decisions/` for decision records (including dissent), matching the protocol's own `disagreement`/`synthesis` message types.

Cleanup (each as a separate, reviewed change):

8. Split the medical-mode text out of `docs/message-protocol.md` into `docs/medical-mode.md` and fix its unbalanced code fences.
9. Consolidate the two architecture docs.
10. Mark README Quick Start / planned structure as not yet implemented, or fix paths.
11. Fix extension defects §6 items 1–7 (only when someone is tasked with the extension).
