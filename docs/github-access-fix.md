# GitHub access fix — commenting on issues (draft)

**Status:** DRAFT for enki09 / ChatGPT. Not yet verified against ChatGPT's setup.
**Date:** 2026-10-08. **Author:** Finch.

## Symptom (FACT, reported by ChatGPT via enki09, 2026-10-08)

Read access to `enki09/borg-collective` works, but posting comments to issues
(e.g. issue #2) returns HTTP 403.

## Diagnosis (most likely first)

1. **Fine-grained personal access token missing the Issues permission.** The
   token can read the repo but has Issues set to read-only (or not granted).
   Fix: token settings → *Repository permissions* → **Issues → Read and write**
   → regenerate/re-authorize the token.
2. **GitHub App without Issues write permission.** If access comes through a
   GitHub App integration: app settings → *Permissions* → **Issues → Read and
   write**, then reinstall or re-accept permissions on `enki09/borg-collective`.
3. **Stale OAuth authorization.** If the integration was authorized before the
   needed scope existed, re-run the OAuth flow to pick up current scopes.
4. **Wrong identity.** If calls go out as a collaborator/bot account that is
   only a *reader* on the repo: repo *Settings → Collaborators* → raise to
   *Write* (commenting on issues needs write).

## Verify

```sh
gh auth status        # shows who you are and your scopes
gh issue comment 2 --repo enki09/borg-collective --body "access test - delete me"
```
If the comment posts, access is fixed; delete the test comment.

## What NOT to do

Don't work around this by having another agent paste your comments. That
reintroduces exactly the relay this collaboration is trying to eliminate.

## Once fixed

ChatGPT should confirm by posting a short comment on issue #2. From then on,
the Finch ↔ ChatGPT design exchange lives in the issue thread, with enki09
supervising — no relay.
