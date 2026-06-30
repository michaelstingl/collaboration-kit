# Changelog

Notable changes to the kit convention (`kit.schema.json`) and tooling (`board.ts`, `new-kit.ts`).
Format: [Keep a Changelog](https://keepachangelog.com); versioning follows SemVer (see the
README "Versioning" section). The canonical version number lives only in `kit.schema.json`
(`version`); this file is the only place release notes live.

## 0.2.0

The kit convention gains a machine-readable contract and tooling.

### Added
- `kit.schema.json` — generic kit frontmatter contract (required: `kit, title, status, created, updated`; optional: `kit_version, area, links`; `additionalProperties` allowed). `status` is an `enum` and the single source for the board's sort order.
- `board.ts` — read-only status board over `kits/*/SCOPE.md`; aggregates structured `TODO`/`DECISION`/`QUESTION`/`FIXME` markers (open unless `status=done`/`wontfix`); warns on drift (status off-enum, `kit` slug ≠ folder, malformed dates); reports the convention version.
- `new-kit.ts` — scaffold a kit from the template with the frontmatter stamped from the schema (including `kit_version`).
- Template (`template/SCOPE.md`): a structured TODO-marker example, `## Next steps`, and `## Changelog` sections.
- README: "The board" and "Versioning" (SemVer policy) sections.

### Notes
- SemVer policy: `kit.schema.json` is the contract; its compatibility sets the bump. The version lives only in the schema (`board.ts` reads it, the README never restates it) and release notes live only here, so a release touches just two files.

## 0.1.0

### Added
- Initial kit convention: a durable per-problem scratch folder with a `SCOPE.md` lead file (frontmatter + dossier sections) and a `template/` (`SCOPE.md`, `issue.md`, `pr-body.md`).
