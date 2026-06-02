# collaboration-kit

A working convention: keep one durable scratch folder, a "kit," for each problem. The folder holds the problem's analysis, its build (a git worktree), and its issue and PR bodies. Keeping them together lets the work survive long sessions, keeps parallel tasks separate, and lets the pull request open from its own branch.

Released into the public domain under [CC0](LICENSE). No attribution required.

## Why

Work on a codebase is rarely one clean edit. It involves investigation, a few false starts, notes, a branch, and a draft of the pull request. Over a long session, or an AI-assisted one where the working context is easily lost, that material scatters: the notes sit in one place, the branch in another, and the PR text gets improvised at the end. Once two problems are open at the same time, switching branches in a single checkout adds friction.

A kit keeps everything for one problem in one named folder:

- It lives on disk rather than in memory or a chat window, so it survives an interruption or a context reset.
- Each problem gets its own git worktree, so several problems can be open at once without switching branches in the main checkout.
- The decision, the rejected alternative, the reproduction, and the verification evidence sit next to the diff, and the pull request opens from the kit's branch.

The convention is small. Most of it is a naming rule and a folder layout.

## Status

Version 0.1, experimental. The conventions will change. A kit records the version it was built under in `kit_version` (in `SCOPE.md`), so an older kit stays readable after the schema changes.

## Personal by default, shareable on demand

A kit usually lives in one person's own gitignored scratch, private to that person. That fits most cases, because a kit is working notes and the pull request is what others read. When a handoff or a review calls for it, the kit can be shared. The unit to share is `SCOPE.md`, the dossier that records the decision, the rejected alternative, the reproduction, and the verification evidence. Post it into the issue or PR thread, or hand over the folder. The `kit_version` field tells the reader which conventions it follows.

## Naming

```
kits/<slug>/
```

A kit is named after the problem, not the issue number. Issue and PR numbers live only in the `SCOPE.md` frontmatter, so there is no rename from a placeholder to a number when the issue is filed.

- The folder name is the problem slug. Do not put the issue number in it.
- For a single-repo problem, the slug may carry the repo name as a scanning hint, such as `webapp-dark-mode/`. For a cross-repo problem, the slug is just the problem, such as `session-expiry/`.
- Numbers are assigned at post time and change; the slug is known up front and stays fixed. Naming on the fixed value removes the rename.

## Starting a kit

Copy the skeleton into a gitignored scratch directory (for example `_work/`) and rename it:

```sh
cp -r template _work/kits/<slug>
```

`template/` holds a `SCOPE.md` skeleton and `issue.md` and `pr-body.md` stubs. The stubs carry `<!-- guidance -->` comments to delete before posting. The template is a copy source, not a kit. Fill in the frontmatter, then add the worktrees described below.

## What's in a kit

A small single-repo kit contains only the starred files:

```
kits/<slug>/
  SCOPE.md        ★ static dossier: what it is, repro, verification evidence, the decision
  <repo>-fix/       git worktree where the branch is built and verified
  issue.md        ★ the issue body (one physical line per paragraph or bullet)
  pr-body.md      ★ the PR body (same line grammar)
  PLAN.md           for real investigations: theses, alternatives, dated worklog
  FIX-PLAN.md       when the approach needs a written design brief
```

A cross-repo problem uses one kit with one worktree per repo and one body pair per repo. A single `SCOPE.md` covers the whole problem:

```
kits/session-expiry/
  SCOPE.md             one dossier for the whole problem
  server-fix/          worktree, branch fix/session-expiry
  client-fix/          worktree, branch fix/session-expiry
  issue-server.md  pr-server.md
  issue-client.md  pr-client.md
```

`SCOPE.md` carries light YAML frontmatter so kits stay scannable. `kit_version` records the conventions the kit was built under. `repos:` is a list of one or more entries, so a single-repo kit is a one-element list and the schema does not change when a second repo joins:

```yaml
---
kit: session-expiry
kit_version: 0.1        # kit conventions this kit was built under
title: "session expiry: server cutoff + client re-auth prompt"
status: building        # scoping, building, submitted, merged, closed, parked. Kit-level; merged only once every repo's PR is in.
created: 2026-06-02
updated: 2026-06-02
repos:
  - repo: example/server
    branch: fix/session-expiry
    issue: 12
    pr: 14
  - repo: example/client
    branch: fix/session-expiry
    issue: 5
    pr: 7
---
```

## Worktree per repo

Each repo a problem touches gets its own git worktree, created inside the kit. A single-repo problem has one. If the repos are sibling checkouts in a multi-repo workspace, a cross-repo problem has several side by side. The worktree isolates the work so several problems can be open at once without switching branches in the main checkout, it survives a long session, and the pull request opens from that branch.

Create one worktree per repo into the kit, all on the same branch name `fix/<slug>`:

```sh
git -C client worktree add \
  _work/kits/<slug>/client-fix \
  -b fix/<slug> origin/main
# cross-repo: repeat per repo into the same kit
git -C server worktree add \
  _work/kits/<slug>/server-fix \
  -b fix/<slug> origin/main
```

Build and verify inside each worktree: change into `<repo>-fix`, install, and run that repo's checks. A worktree shares its repo's object store but keeps its own HEAD, so the main checkout is untouched. Worktrees are cheap to recreate, so they are not precious, but keeping them in the kit means the build survives a long session.

Record each repo's branch and PR in the `repos:` frontmatter. Remove a worktree once its PR merges. Use `git worktree remove` rather than `rm -rf`: a manual delete leaves a stale registration in the repo's `.git/worktrees/` that then needs `git worktree prune`.

```sh
git -C client worktree remove _work/kits/<slug>/client-fix
```

Keep each branch until its PR is merged or closed.

### Coordinating cross-repo PRs

When one problem spans repos, the PRs are separate but related:

- Each PR body references the others, such as "part of session-expiry; depends on server#14", so a reviewer sees the whole shape.
- `SCOPE.md` records a merge order when one repo depends on another, such as a server endpoint before the client that calls it. The kit's `status` reaches `merged` only once every repo's PR is in.

## File grammar

- GitHub bodies use one physical line per paragraph or bullet, because GitHub renders single newlines as hard breaks. These documentation files wrap normally.
- Start an outward artifact's filename with its object type (`issue-`, `pr-`) so it is easy to place at a glance.
- Name a body by its repo, not by issue or PR number: `issue.md` and `pr-body.md` for a single-repo kit, `issue-<repo>.md` and `pr-<repo>.md` when the kit spans repos. The repo is known up front; the number is not. This is the same reason the folder drops the number.
- Prefix a throwaway draft with `_`, such as `_pr-body-v2.md`. The file without the prefix is the one to post.
- Keep one canonical document per role. Iterate inside it rather than spawning `SCOPE-v2.md`.

## Rules of thumb

- The verification gate, meaning the compiler, the tests, the linter, and CI, is the one check that does not depend on the author's reasoning. Show that the problem fails the gate, show that the fix passes it, and state any untested gap. Put evidence before assertions.
- Ground the change against the project's dominant constraint, whether a specification, an RFC, a license boundary, or a style guide. Name the constraint. If a change risks it, stop and flag it.
- Helper scripts such as repro drivers and probes live in the kit, not in `/tmp`. If it is worth re-running after a context reset, it belongs in the kit.
- Do not clean up unrelated code while fixing a problem. One PR, one change.
- A problem that is only observed, not investigated, stays at `SCOPE.md` alone.

## Lineage

The convention was distilled from a contribution-method playbook used in practice and refined across real pull requests. The idea that carries over is that the verification gate is the only check independent of the author's reasoning, and that one durable folder per problem works better than scattered notes.
