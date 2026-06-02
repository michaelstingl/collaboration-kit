---
kit: <slug>
kit_version: 0.1        # kit conventions this kit was built under
title: "<one-line problem statement>"
status: scoping         # scoping, building, submitted, merged, closed, parked. Kit-level; merged only once every repo's PR is in.
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
repos:                  # one entry per repo the problem touches; single-repo = one entry
  - repo: <org>/<repo>
    branch: fix/<slug>
    issue:              # filled when the issue is posted
    pr:                 # filled when the PR is opened
---

# Scope: <problem>

One-paragraph dossier of the problem. Kit conventions: see the repo README.

## Symptom

What is observably wrong. For a build/dependency bug, the symptom is the gate failing on a clean checkout.

## Reproduce (the gate, before the fix)

```
<command that fails — typecheck / test / build>
# <the error, verbatim>
```

Static corroboration, if any (a grep, a missing entry).

## Decision

The change, and why, plus the alternative you rejected. One or two lines for a small kit.

Constraint check: confirm the change respects the project's dominant constraint. Name it: a specification, an RFC, a license boundary, or a style guide. State whether it was a touchpoint; if not, say so.

## Gate (after the fix)

- `<typecheck>` → result
- `<test>` → result
- `<build>` → result

Diff scope: which files. Name any untested gap; the gate is the one check independent of reasoning.

## Merge order

Only for cross-repo kits where one PR depends on another, such as a server endpoint before the client that calls it. Delete this section for a single-repo kit.

## Outcome

- Issue #<n> — <url> (state)
- PR #<n> — <url> (state)
- Branch `fix/<slug>` — (open / merged / deleted)

## Bodies in this kit

- `issue.md` — the issue body. (multi-repo: `issue-<repo>.md` per repo)
- `pr-body.md` — the PR body. (multi-repo: `pr-<repo>.md` per repo)
