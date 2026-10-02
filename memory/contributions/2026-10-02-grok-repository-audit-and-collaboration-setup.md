# Repository audit and multi-agent collaboration setup

- **Agent / model:** Grok — an AI agent running as "Grok Bot"; model/provider: Grok (xAI); exact underlying model version: UNKNOWN to the agent
- **Operator / human:** enki09 (INDE)
- **Date / time:** 2026-10-02, audit started about 7:24 PM EDT (UTC-4); committed 2026-10-02 7:31 PM EDT (UTC-04)
- **Follow-up to:** none (first record)

## Objective

1. Read-only audit of `enki09/borg-collective`: purpose, architecture, implementation state, agent/memory files, permissions, branch protection; compare with `enki09/Hub`.
2. Then, with explicit maintainer authorization for this one contribution: add `AGENTS.md`, `PROJECT_MEMORY.md`, `memory/contributions/README.md`, and this record, committed and pushed directly to `main`.

## Work performed

- Cloned `enki09/borg-collective` and `enki09/Hub` locally (read-only) with the gh CLI, authenticated as enki09.
- Compared them: `gh repo view --json isFork,parent`, full `git log --all`, `git ls-tree` diff, `diff -r`.
- Listed branches (local, remote, `git ls-remote`, GitHub API) and searched every file path in every commit, case-insensitively, for agent/memory/handoff/instruction files (AGENTS, memory, handoff, claude, cursor, copilot, instruct, CODEOWNERS, workflow, LICENSE, pull_request).
- Read every file: `README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `architecture.md`, `borg_spec.json`, `docs/architecture.md`, `docs/message-protocol.md`, `examples/*.md`, `extension/*`, `.github/ISSUE_TEMPLATE/*`, `.gitignore`.
- Read-only GitHub API queries: repo permissions and settings, branch protection, rulesets, issues, PRs, contributors, collaborators, labels, workflows, commit signature verification.
- Wrote the four files listed below. Before committing: re-read them against the repo, reviewed `git diff --cached`, and ran a regex scan for secrets.

## Artifacts changed

- Files (new): `AGENTS.md`, `PROJECT_MEMORY.md`, `memory/contributions/README.md`, `memory/contributions/2026-10-02-grok-repository-audit-and-collaboration-setup.md`
- Commits: one commit on `main` (see `git log`; the hash cannot be written inside the commit that contains it)
- PRs / issues: none
- No other files, repositories (including `enki09/Hub`), or settings were changed.

## Findings

- FACT: `enki09/borg-collective` and `enki09/Hub` have identical history (27 commits, HEAD `f2595af`) and identical trees. GitHub reports neither as a fork.
- FACT: `enki09/borg-collective` was created and fully committed on 2025-12-03, 2:22–4:09 PM EST (UTC-5). `enki09/Hub` was created 2026-07-23 10:04 AM EDT (UTC-4). `borg-collective` had not been pushed to since 2025-12-03 until this commit; `Hub` has not been pushed to since its creation day.
- FACT: only the `main` branch exists. No AGENTS.md, project-memory, handoff, CODEOWNERS, LICENSE, PR template, or workflow file existed in any commit before this one.
- FACT: gh token has admin/maintain/push on the repo. `main` had no branch protection (API 404 "Branch not protected") and no rulesets. Discussions are disabled. No issues, PRs, forks, or stars.
- FACT: the project is a v0.1.0 design spec (`borg_spec.json`). Only ROADMAP Milestone 0 is done. `extension/` is an MV3 scaffold.
- HYPOTHESIS: the extension does not work end-to-end (missing `action`, missing `storage` permission, host mismatch, no `borg_broadcast` listener). It was not run in a browser during this audit.
- Full defect list: `PROJECT_MEMORY.md` §6.

## Reasoning / important decisions

- **Canonical repo:** treated `enki09/borg-collective` as canonical because it is the original (created 2025-12-03 vs 2026-07-23), it has the description, and `README.md` clones from it. This is a working assumption recorded as HYPOTHESIS in `PROJECT_MEMORY.md`, not a maintainer DECISION.
- **Kept the structure small:** one protocol file, one memory file, one append-only records directory. No CODEOWNERS, templates, CI, or settings changes. Those are left as proposals for the maintainer.
- **Pushed directly to `main`** because enki09 explicitly authorized this one contribution that way. This is an exception. PROPOSAL: future work should go through PRs once branch protection exists.
- **Did not fix any defects.** The task was documentation and collaboration scaffolding only.
- **Personal data:** the maintainer is referred to by GitHub handle only. The commit email is the GitHub noreply address.
- **`memory/` directory name:** used as requested, even though `borg_spec.json` plans a runtime `memory/` directory for session transcripts. Recorded as an open question in `PROJECT_MEMORY.md` §9.

## Failed approaches

- None of substance. The GitHub MCP connectors were not used; the gh CLI was used as instructed. `xxd` was not installed, so `od` was used to inspect `extension/icons`.
- Correction made before committing: my first draft described the `docs/message-protocol.md` fence problem inaccurately. Re-checking showed the `json` fence at line 16 is never closed as well, and the text was corrected.

## Uncertainty / disagreements

- UNKNOWN: why `enki09/Hub` exists and whether it is meant to replace `borg-collective`.
- UNKNOWN: which architecture doc is authoritative; Medical Triage Mode scope; intended license; whether the extension was ever tested.
- Rendering statements about unbalanced fences rely on CommonMark rules. Not verified in the GitHub web view.
- No disagreements with earlier records (none existed).

## Recommended next actions

- PROPOSAL: maintainer records a DECISION on canonical repo vs `enki09/Hub`.
- PROPOSAL: protect `main` (require PR, code-owner review, status checks, no force-push); add `.github/CODEOWNERS` and `.github/pull_request_template.md`.
- PROPOSAL: add CI (JSON validity / envelope JSON Schema, markdown lint and link check, JS lint, manifest validation).
- PROPOSAL: separate cleanup PRs: split `docs/medical-mode.md` out of `docs/message-protocol.md`; consolidate the two architecture docs; correct README Quick Start; add LICENSE; enable Discussions or drop the reference.
- PROPOSAL: fix extension defects only when the extension is the assigned task.

## Durable information for PROJECT_MEMORY.md

- Incorporated into PROJECT_MEMORY.md: **yes** (all findings, history, known problems, open questions, proposals).
