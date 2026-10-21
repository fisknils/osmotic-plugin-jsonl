# feature/jsonl-exporter

## Prompts

1. The repository was empty. The user asked for a new plugin, modelled on osmotic-plugin-csv, and for its contributor
   rules to be copied.

   > Create an export plugin for osmotic that exports to a jsonl file.
   > You can have a look at osmotic-plugin-csv to see how export plugins work (copy it's CLAUDE.md)
   >
   > osmotic: https://github.com/fisknils/osmotic
   > osmotic-plugin-csv: https://github.com/fisknils/osmotic-plugin-csv
   >
   > start by setting up a remote via gh (this counts as approval)

## Interpretation

Build `osmotic-plugin-jsonl`, an osmotic plugin that registers a `jsonl` export type, so
`.export('jsonl', file, options)` writes each data object that reaches the step as one line of JSON in a
[JSON Lines](https://jsonlines.org/) file. It follows osmotic-plugin-csv's shape: a factory that is itself a plugin and,
called with options, returns a configured one; a `type` plugin option for side-by-side defaults; streaming to disk; the
file starting over on every run; write errors failing the run. The repository gets the same layout, tooling, CI, branch
protection and contributor rules (`CLAUDE.md`, already on `master`) as osmotic-plugin-csv.

## Type

Feature

## Breaking change

No. This is the first release.

## Version bump

None: the package starts at 1.0.0.

## Scope

In:

- The `jsonl` export type: UTF-8, no byte order mark, one `JSON.stringify()` object per line, every line ending in
  `\n`. Line breaks inside values are escaped by JSON, so a row never spans lines.
- Export option `fields`: which fields to write, in that order. Fields missing from a row are written as `null`, so
  every line has the same keys. Without it, every row is written as is.
- Plugin options set the defaults for every file; `type` registers them under another export type.
- CommonJS and ESM entry points sharing one factory, type declarations merging `jsonl` into osmotic's `ExportTypes`.
- Tests, type tests, an example, README, CHANGELOG, CI workflow, package metadata.

Out:

- Appending to an existing file, compression, pretty-printing (not valid JSON Lines), and a configurable line ending.
  Each can come later as an option without breaking anything.
- Values JSON can't represent (`BigInt`, circular objects): osmotic's extractors only produce strings, arrays and plain
  objects, so `JSON.stringify()`'s own behavior is kept and not tested.

## Acceptance criteria

- [ ] With the default options, each row becomes one line of JSON ending in `\n`, with no byte order mark, quotes,
      backslashes and line breaks escaped, and text outside ASCII written as UTF-8. (`test/format.ts`)
- [ ] Arrays and objects are written as JSON arrays and objects, not strings. (`test/format.ts`)
- [ ] `fields` writes only those fields, in that order, and missing ones as `null`. (`test/options.ts`)
- [ ] Options passed to `.export()` apply to that file and override the plugin's defaults. (`test/options.ts`)
- [ ] A plugin loaded with another `type` registers that export type with its own defaults. (`test/options.ts`)
- [ ] Each run starts the file over. (`test/run.ts`)
- [ ] A file that can't be opened fails the run instead of crashing the process. (`test/run.ts`)
- [ ] `require()` returns the factory itself, `import` gets the same function, and the factory called with a `type`
      returns a plugin named `osmotic-plugin-jsonl:<type>` with that one export type. (`test/package.ts`)
- [ ] `.export('jsonl', ...)` checks its options in TypeScript, for CommonJS and ES module callers, and the option types
      are exported. (`test-d/`)

## Affected public API

Added:

- Export type `jsonl`, with options `fields?: string[] | null`.
- Plugin options: the export options, plus `type?: string`.
- Types `JsonlOptions` and `JsonlPluginOptions`, and the `jsonl` entry in osmotic's `ExportTypes`.

## Impact on the rest of the codebase

- Checked: osmotic's `Exporter`, `ExporterFactory`, `ExportTypes` and `OsmoticPlugin` (`src/exporters.ts`,
  `src/plugins.ts` in osmotic 3.0.0), and how `ExportTarget` creates one exporter per run on the first row; the
  `jsonl` example in osmotic's README, which registers a `jsonl` type with `Osmotic.exporter()`; osmotic-plugin-csv as
  the other plugin registering export types.
- Found: osmotic's README uses `jsonl` as the example name for `Osmotic.exporter()`, with `{ pretty?: boolean }` as
  example options. Loading this plugin and running that example in the same process would throw, since export types are
  unique. That's documentation only; see Follow-ups. Nothing else.

## Decisions

- Missing fields under `fields` are written as `null` rather than left out: the point of listing fields is that every
  line has the same shape, which tools such as DuckDB and pandas rely on.
- No warning for fields left out by `fields`. osmotic-plugin-csv warns because its columns may come from the first row;
  here leaving fields out only happens when the caller lists the fields, so it's always intended.
- No byte order mark, unlike the CSV plugin's default: JSON (RFC 8259) forbids one, and most JSON Lines readers fail on
  it.

## Verification

## Follow-ups

- osmotic: the README could link this plugin next to the CSV one, and its `Osmotic.exporter()` example could use a
  name other than `jsonl` to avoid clashing with it.
- Publish `osmotic-plugin-jsonl` 1.0.0 to npm after merging (osmotic 3.0.0, the peer dependency, is published).
