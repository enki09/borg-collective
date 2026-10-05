# AGENTS.md — Onboarding Protocol for Agents

This file is the standing protocol for **any** contributor to this repository, human or AI, from any provider. Read it before doing work here.

Rules marked "(DECISION 2026-10-04, enki09)" were approved by the maintainer after protocol review round 1. See `PROJECT_MEMORY.md` → "Maintainer decisions" for the full list and its sources.

## 1. Identify yourself

- State who you are: agent name, model and provider if known (e.g. "Claude (Anthropic)", "Grok (xAI)", "local Llama via Ollama"), and the human or operator you act for, if any.
- If you do not know your exact model version, say so. Do not guess.
- Never impersonate another agent, another model, or a human. Never present AI-written work as human-written.
- Use the same identity in commits, PR descriptions, and contribution records (see §8).
- **Commit identity** (DECISION 2026-10-04, enki09):
  - Each agent commits with its own distinct author email, controlled by the maintainer. enki09 will assign the exact addresses.
  - Never use a GitHub noreply address that may belong to another GitHub user. For example, `<name>@users.noreply.github.com` maps to whichever GitHub account has that login.
  - Every agent commit carries a trailer in this format: `Agent: <Name> (<model/provider>) via <harness>, operated by enki09`. Keep using it after emails are assigned.

## 2. Read before you work

1. Read `PROJECT_MEMORY.md` before any substantial work.
2. Read **all** records in `memory/contributions/`, newest first (date-prefixed filenames sort by date), while there are fewer than about 10 records (DECISION 2026-10-04, enki09). An index will be introduced later; until it exists, read everything.
3. **Inspect the current repository files relevant to your task.** Do not assume `PROJECT_MEMORY.md` is current.

**Source-of-truth order:**

1. The repository files themselves (code, `borg_spec.json`, docs) as they exist on `main`.
2. `borg_spec.json` is the primary design specification for BORG.
3. `PROJECT_MEMORY.md` and `memory/contributions/` are summaries and history.

When the repo files and the memory files conflict, **the repo files win**.

**Correcting memory** (DECISION 2026-10-04, enki09):

- **Factual errors** may be corrected directly in `PROJECT_MEMORY.md`. Examples: a claim contradicted by current files, command output, or API responses. Cite the evidence in your contribution record.
- **Judgments, hypotheses, proposals, and opinions** recorded by others are never overwritten. If you disagree, say so in a new contribution record and add or update the entry in the "Contested" section of `PROJECT_MEMORY.md` (see §4).

## 3. Label what you claim

Use these labels in memory files, contribution records, issues, and PRs:

| Label | Meaning |
|---|---|
| **FACT** | Directly verified from a file, command output, or API response. Cite the source (file path, commit, command). |
| **HYPOTHESIS** | A plausible inference not yet verified. Say what would confirm or refute it. |
| **PROPOSAL** | A suggested change or course of action. Not yet agreed. |
| **DECISION** | Something the maintainer (enki09) has approved, or that is recorded as decided in the repo. Say who decided and where. |
| **UNKNOWN** | Explicitly not known. Better than a guess. |

Do not upgrade a hypothesis to a fact, or a proposal to a decision, without evidence or maintainer approval.

## 4. Preserve disagreement and uncertainty

- If you disagree with an earlier agent, a memory entry, or a design doc, record the disagreement and your reasoning **in a contribution record**. Do not silently overwrite or smooth it over. Factual corrections are the exception; see §2.
- Open disagreements are summarized in the "Contested" section of `PROJECT_MEMORY.md`, with both positions and links to the records. Only a maintainer DECISION resolves them (DECISION 2026-10-04, enki09).
- Do not manufacture consensus. "Agent A thinks X, Agent B thinks Y, unresolved" is a valid and useful state.
- **Weighing evidence** (DECISION 2026-10-04, enki09):
  - Independent verification by agents from different providers weighs more than repeated agreement.
  - Agreement by volume is not consensus.
  - Agent agreement is never authority; only the maintainer decides.
- Keep confidence honest. Mark uncertainty explicitly.

## 5. Secrets and personal data

- Never commit, print, or paste credentials, tokens, API keys, passwords, cookies, or private keys.
- Never commit personal information about the maintainer or anyone else (emails other than GitHub noreply addresses, phone numbers, addresses, etc.). Refer to the maintainer by GitHub handle: **enki09**.
- If you find a secret in the repo, do not copy it anywhere; report it to the maintainer.

## 6. Externally consequential actions need explicit authorization

Do **not** do any of the following unless the maintainer (enki09) has explicitly authorized that specific action:

- Pushing to `main` (or force-pushing anywhere)
- Merging pull requests (only enki09 merges)
- Opening, editing, or closing issues or discussions, or editing or closing other contributors' PRs
- Changing repository settings, branch protection, collaborators, or secrets
- Posting publicly, contacting people, or sending messages
- Spending money or creating accounts/services
- Deleting branches, tags, or files outside your task scope

**Workflow** (DECISION 2026-10-04, enki09): all work goes **branch → pull request → maintainer review**.

- Agents **may** open pull requests from their own branches against `main`.
- Only the maintainer (enki09) merges.
- The direct push to `main` in commit `dd3d265` was a one-time, maintainer-directed exception, not a precedent.
- Reading, cloning, and local experimentation are fine.

## 7. Scope discipline

- Do the task you were given. Do not redesign BORG or fix unrelated code without asking; record what you noticed in your contribution record and in `PROJECT_MEMORY.md` → "Known problems" instead.
- Keep the message envelope consistent across `borg_spec.json`, `docs/message-protocol.md`, and `extension/` code. If you change one, check the others.
- Follow the safety rules in `borg_spec.json` (`protocol.safety_rules`, `ethics_and_safety`).

## 8. Leave a record

After any substantial work, add a contribution record in `memory/contributions/` following `memory/contributions/README.md` (DECISION 2026-10-04, enki09).

- **Substantial work:**
  - changes to the spec, protocol, or code behavior;
  - audits or reviews;
  - recording or proposing decisions;
  - stating a disagreement.
- **Small work** (e.g. minor doc fixes) uses the short record form. Trivial typo fixes need no record.
- Every record states its **memory baseline**: the `main` commit hash you read before working.
- Records are append-only.
- Update `PROJECT_MEMORY.md` with durable information, following §2's correction rules, and update its "Last updated" line.
