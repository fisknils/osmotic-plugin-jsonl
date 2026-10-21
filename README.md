# osmotic-plugin-jsonl

An [osmotic](https://www.npmjs.com/package/osmotic) plugin that exports scraped rows
to [JSON Lines](https://jsonlines.org/) files with `.export('jsonl', file, options)`.

```js
const { Osmotic } = require('osmotic');

Osmotic.plugins([require('osmotic-plugin-jsonl')]);

Osmotic.get('https://news.ycombinator.com')
	.find('tr.athing')
	.set({ rank: '.rank', title: '.titleline > a', link: '.titleline > a@href' })
	.export('jsonl', 'hacker-news.jsonl')
	.run();
```

- Rows are streamed to disk as they arrive, one JSON object per line
- Arrays and nested objects stay JSON, not strings
- UTF-8 without a byte order mark, every line ending in `\n`, as JSON Lines readers
  such as `jq`, DuckDB and pandas expect
- Several sets of defaults side by side, each under its own export type

## Installation

```sh
npm install osmotic osmotic-plugin-jsonl
```

`osmotic` (3.0.0 or later) is a peer dependency, so install it alongside the plugin.

## Usage

Load the plugin once, before building any chains:

```js
// CommonJS
const { Osmotic } = require('osmotic');
Osmotic.plugins([require('osmotic-plugin-jsonl')]);

// ES modules / TypeScript
import { Osmotic } from 'osmotic';
import jsonl from 'osmotic-plugin-jsonl';
Osmotic.plugins([jsonl]);
```

Then add `.export('jsonl', file, options)` where the rows are complete. Each `data`
object reaching that step becomes a line:

```js
Osmotic.get('https://example.com/products')
	.find('.product')
	.set({ name: 'h2', price: '.price', tags: ['.tag'] })
	.export('jsonl', 'products.jsonl')
	.run();
```

```jsonl
{"name":"Desk lamp","price":"499,00","tags":["LED","Dimmable"]}
{"name":"Shelf","price":"899,00","tags":[]}
```

The file is created when the first row of a run arrives, and starts over on every run.
Branches run concurrently, so lines are in the order rows arrive, not page order.
osmotic closes the file when the run ends, and the run fails if the file can't be
written.

Values are written with `JSON.stringify()`, so a field whose value is `undefined`, such
as an attribute that wasn't found, is left out of its line unless `fields` lists it.

## Options

Pass options to `.export()` for one file, or to the plugin to change the defaults for
every file:

```js
Osmotic.plugins([require('osmotic-plugin-jsonl')({ fields: ['name', 'price'] })]);
```

| Option   | Default                 | Description                                                                                                           |
| -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `fields` | every field of each row | The fields to write, in that order. Fields missing from a row are written as `null`, so every line has the same keys. |
| `type`   | `'jsonl'`               | Plugin only: the export type to register.                                                                             |

### Several sets of defaults

Load the plugin again with another `type` to use different defaults side by side:

```js
const jsonl = require('osmotic-plugin-jsonl');

Osmotic.plugins([jsonl, jsonl({ type: 'jsonl-prices', fields: ['name', 'price'] })]);

chain.export('jsonl', 'everything.jsonl').export('jsonl-prices', 'prices.jsonl');
```

## TypeScript

Type declarations are included for both entry points. Loading the plugin's types
declares the `jsonl` export type, so `.export('jsonl', ...)` checks its options. The
`JsonlOptions` and `JsonlPluginOptions` types are exported. For another `type`, declare
it yourself:

```ts
import type { JsonlOptions } from 'osmotic-plugin-jsonl';

declare module 'osmotic' {
	interface ExportTypes {
		'jsonl-prices': JsonlOptions;
	}
}
```

## Development

```sh
npm install            # install dependencies (does not build)
npm run build          # clean dist/ and compile src/ with tsc (also runs before npm publish)
npm test               # build, type check test/ and test-d/, and run the tests with tsx
npm run format         # format everything with Prettier
npm run format:check   # check formatting without writing
```

The tests use the osmotic checkout next to this one (`file:../osmotic`), so build it
first.

| File                              | Responsibility                                  |
| --------------------------------- | ----------------------------------------------- |
| `src/core/plugin.ts`              | The plugin and its exporter                     |
| `src/core/JsonlWriter.ts`         | Streaming JSON Lines writer                     |
| `src/types/options.ts`            | Options, and the `jsonl` entry in `ExportTypes` |
| `src/index.cts` / `src/index.mts` | CommonJS and ESM entry points                   |

## License

ISC
