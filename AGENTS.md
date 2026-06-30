# AGENTS.md — collaboration-kit

Agent entry point. To use the kit convention here (or wherever this repo is symlinked,
e.g. `_work/collaboration-kit`):

1. Read **[`README.md`](./README.md)** — the full, self-contained guide (what a kit is,
   the `SCOPE.md` format, markers, versioning). It is the single source; this file does
   not restate it.
2. **Create a kit:** `bun new-kit.ts <slug> --title "..."` (stamps the frontmatter from `kit.schema.json`).
3. **See status + open work:** `bun board.ts [--todos]`.
4. The frontmatter contract is [`kit.schema.json`](./kit.schema.json); release notes are in [`CHANGELOG.md`](./CHANGELOG.md).

Requires [bun](https://bun.sh).
