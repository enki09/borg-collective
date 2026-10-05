# Recording maintainer decisions from protocol review round 1

- **Agent / model:** Grok, an AI agent running as "Grok Bot". Model/provider: Grok (xAI). Exact underlying model version: UNKNOWN to the agent.
- **Operator / human:** enki09
- **Date / time:** 2026-10-04 8:59 PM EDT (UTC-04)
- **Memory baseline:** main@dd3d26547cfd1b57bbd0d189e0b4cf2e05bbe4ce (`main` had not moved since `dd3d265` when this branch was created)
- **Follow-up to:**
  - [Finch synthesis](https://github.com/enki09/borg-collective/blob/d47befe258ba2c05d23b2dafef5fa03002b394cd/memory/contributions/2026-10-02-finch-synthesis-round-1.md) (`d47befe`)
  - [Grok response](https://github.com/enki09/borg-collective/blob/cb9fd8404d4cceb1417e90842d53487cbbfcf571/memory/contributions/2026-10-02-grok-response-to-finch-memory-review.md) (`cb9fd84`)
  - [Finch review](https://github.com/enki09/borg-collective/blob/908ae3143314727db78434ee7368908fa6413d30/memory/contributions/2026-10-02-finch-collaboration-memory-review.md) (`908ae31`)

## Objective

The maintainer (enki09) explicitly approved a set of decisions from protocol review round 1 and asked me to:

- (A) set the description of `enki09/Hub` and archive it;
- (B) record the decisions in `AGENTS.md`, `PROJECT_MEMORY.md`, and `memory/contributions/README.md` on a new branch;
- open a pull request for enki09 to review and merge.

## Work performed

- Set the `enki09/Hub` description to "Archived copy. Canonical repo: https://github.com/enki09/borg-collective" (`gh repo edit`), then archived it (`gh repo archive --yes`). Verified `isArchived: true` and the new description with `gh repo view`.
- `git fetch`. Confirmed `origin/main` is still `dd3d265`. Created branch `grok/protocol-decisions-round-1` from it.
- Edited `AGENTS.md`:
  - §1: commit identity (D9).
  - §2: read all records (D1); factual corrections vs. judgments (D3).
  - §4: disagreements in records plus the Contested section (D4); evidence weighting (D7).
  - §6: PRs allowed, only enki09 merges, `dd3d265` exception (D8).
  - §8: substantial work, short form, memory baseline (D2, D6).
- Edited `PROJECT_MEMORY.md`:
  - removed the "Latest contribution record" pointer (D5);
  - added known problem 15 (attribution of `908ae31`, D10);
  - updated history, current state, unresolved questions, and next steps (as PROPOSALS);
  - added §11 "Maintainer decisions" (approved, deferred, resolved, still open) and §12 "Contested".
- Edited `memory/contributions/README.md`: definition of substantial work, short-form template, memory-baseline field and rule, read-all rule, pointer removal, correction rule.
- Wrote this record. Re-read all edits against the instructions and source records, scanned the diff for secrets, pushed only this branch, and opened a PR.

## Artifacts changed

- GitHub settings (maintainer-approved): `enki09/Hub` description changed; repository archived.
- Files: `AGENTS.md`, `PROJECT_MEMORY.md`, `memory/contributions/README.md` (modified); `memory/contributions/2026-10-04-grok-recording-maintainer-decisions.md` (new).
- Commits: one commit on `grok/protocol-decisions-round-1`; its hash is in `git log`.
- PRs: one PR from `grok/protocol-decisions-round-1` into `main`, for enki09 to review and merge. Not merged by me.
- Not changed: `main`, other branches, branch protection, any other settings, any code.

## Findings

- FACT: before archiving, `enki09/Hub` had an empty description and had last been pushed on 2026-07-23 (10:04 AM EDT).
- FACT: `origin/main` = `dd3d265` at branch creation. Branches present: `finch/memory-system-review` (`908ae31`), `finch/synthesis-round-1` (`d47befe`), `grok/response-to-finch-review` (`cb9fd84`).
- FACT: none of the three review-round records are on `main`. This branch links to them by permanent commit URLs rather than copying them.

## Reasoning / important decisions

All DECISIONs recorded here are enki09's (2026-10-04). Judgment calls I made while recording them:

- **Numbering.** Decisions are numbered D1–D11 in `PROJECT_MEMORY.md` §11, and each cites the synthesis item number it came from. `AGENTS.md` marks each changed rule "(DECISION 2026-10-04, enki09)" and points to §11, rather than repeating the full list.
- **§6 wording.** I replaced the blanket "opening … PRs needs authorization" with: agents may open PRs from their own branches; merging is enki09's only; editing or closing *other contributors'* PRs, and opening, editing, or closing issues and discussions, still need authorization. The decision covered opening PRs only, so I kept the rest restricted.
- **"Small work".** The decision named a short form but not its scope. I defined small work as "e.g. minor doc fixes" and kept the existing exemption for trivial typo fixes.
- **Contested section.** It records that no substantive disagreements are open, plus a framing note on the "headers now vs later" item, worded as the maintainer instructed ("likely misstated"). I quoted only what the two records say.
- **Open question added.** Whether the review-round records on `grok/response-to-finch-review` and `finch/synthesis-round-1` will be merged into `main` was not decided. I listed it as UNKNOWN in §9 rather than assuming.
- **Unapproved fixes left alone.** I did not reword the "source-of-truth order" in `AGENTS.md` §2 (conceded as confusing in the Grok response). It was not among the approved changes.
- **Commit identity.** I used the existing local identity, `Grok (AI agent, via enki09) <18298543+enki09@users.noreply.github.com>`, as instructed. That address is the operator's own ID-form noreply, so it does not belong to another GitHub user; a distinct address awaits assignment (D9). Trailer: `Agent: Grok (xAI) via Grok Bot, operated by enki09`.

## Failed approaches

- None.

## Uncertainty / disagreements

- None new. Interpretive choices are listed above for the maintainer to correct in review.
- UNKNOWN: whether enki09 wants the review-round records merged into `main` for completeness.

## Recommended next actions

- PROPOSAL: enki09 reviews and merges (or amends) the PR.
- PROPOSAL: protect `main`, assign agent author emails, add the CI identity check, CODEOWNERS, and a PR template (`PROJECT_MEMORY.md` §10).
- PROPOSAL: decide the `memory/` naming question and whether to merge the review-round records.

## Durable information for PROJECT_MEMORY.md

- Incorporated into PROJECT_MEMORY.md: **yes** (§6 item 15, §7–§12).
