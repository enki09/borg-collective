# Contribution Records (Handoff Log)

This directory is the asynchronous handoff log for everyone working on BORG Collective, human or AI. Each record tells the next contributor what was done, why, what failed, and what is still uncertain. See `AGENTS.md` for the overall protocol.

> Note: this directory holds records about **work on the repository**. It is not the BORG runtime's session memory described in `borg_spec.json` → `memory_format`.

## Rules

1. **One record per substantial session** (code, docs, design work, audits, reviews). Trivial typo fixes do not need one.
2. **File name:** `YYYY-MM-DD-<agent>-<short-topic>.md`
   - date = session date in the timezone you state inside the record
   - `<agent>` = short lowercase agent name (e.g. `claude`, `grok`, `chatgpt`, `gemini`, `human-enki09`)
   - `<short-topic>` = a few lowercase hyphenated words
   - Example: `2026-10-02-grok-repository-audit-and-collaboration-setup.md`
   - If the name is taken, add `-2`, `-3`, …
3. **Append-only.** Never rewrite or delete another contributor's record. To correct, dispute, or extend one, write a new record that links to it ("Follow-up to …"). Fixing your own record's typos in the same session is fine.
4. **Use the labels** from `AGENTS.md` §3: FACT, HYPOTHESIS, PROPOSAL, DECISION, UNKNOWN. Cite file paths, commits, or commands for facts.
5. **No secrets or personal data.** Refer to the maintainer as enki09.
6. **Update `PROJECT_MEMORY.md`** with any durable information, then update its "Last updated" line and "Latest contribution record" pointer. Say in your record whether you did this.
7. Times must include a timezone (e.g. `2026-10-02 19:45 EDT (UTC-4)`).

## Required fields

- **Agent / model** — agent name, model, provider; operator / human on whose behalf you act, if any. Say UNKNOWN for anything you do not know (e.g. exact model version).
- **Date / time** — with timezone.
- **Objective** — what you were asked or set out to do.
- **Work performed** — what you actually did.
- **Artifacts changed** — files, commits (hash), branches, PRs, issues. "None" for read-only sessions.
- **Findings** — what you learned, labeled.
- **Reasoning / important decisions** — judgment calls and why; who authorized what.
- **Failed approaches** — what did not work. "None" if none — say so honestly.
- **Uncertainty / disagreements** — open doubts; disagreements with earlier records or docs.
- **Recommended next actions** — labeled as PROPOSAL unless decided.
- **Durable information for `PROJECT_MEMORY.md`** — and whether it has been incorporated (yes / no / partially).

## Template

Copy into a new file and fill in every section.

```markdown
# <Short title>

- **Agent / model:** <agent name> — <model> (<provider>); exact version: <version or UNKNOWN>
- **Operator / human:** <GitHub handle or "none">
- **Date / time:** <YYYY-MM-DD HH:MM TZ (UTC±H)>
- **Follow-up to:** <link to earlier record, or "none">

## Objective

## Work performed

## Artifacts changed

- Files:
- Commits:
- PRs / issues:

## Findings

- FACT:
- HYPOTHESIS:

## Reasoning / important decisions

## Failed approaches

## Uncertainty / disagreements

## Recommended next actions

- PROPOSAL:

## Durable information for PROJECT_MEMORY.md

- Incorporated into PROJECT_MEMORY.md: <yes / no / partially>
```
