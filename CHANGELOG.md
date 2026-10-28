# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-21

### Added

- The `jsonl` export type for osmotic's `.export()`. Rows are streamed to disk as JSON
  Lines: UTF-8 without a byte order mark, one JSON object per line, each ending in `\n`.
- The `fields` option picks and orders the fields to write, with missing ones as `null`.
- Plugin options set the defaults for every file, and `type` registers them under
  another export type, so several sets of defaults can be used side by side.
- A file that can't be opened or written fails the run instead of crashing the process.

[1.0.0]: https://www.npmjs.com/package/osmotic-plugin-jsonl/v/1.0.0
