# AGENTS.md — collaboration-kit

Agent entry point. To use the kit convention here (or wherever this repo is symlinked,
e.g. `_work/collaboration-kit`):

1. Read **[`README.md`](./README.md)** — the full, self-contained guide (what a kit is,
   the `SCOPE.md` format, markers, versioning). It is the single source; this file does
   not restate it.
2. **Create a kit:** `bun new-kit.ts <slug> --title "..."` (stamps the frontmatter from `kit.schema.json`). Add `--contribution` for a kit that yields an issue/PR.
3. **See status + open work:** `bun board.ts [--todos]`. **Upstream movement:** `bun watch.ts` (issues/PRs your kits reference; needs `gh`).
4. The frontmatter contract is [`kit.schema.json`](./kit.schema.json); release notes are in [`CHANGELOG.md`](./CHANGELOG.md).

Finished kits: set `status: merged|done|closed` (board hides them by default; `--all` shows them) or move them to a sibling `kit-archive/`. To set the system up in a new project, see the README → "Adopt in a project".

Requires [bun](https://bun.sh).
