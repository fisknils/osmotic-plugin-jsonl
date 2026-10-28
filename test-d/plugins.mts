// Loading the plugin, as an ES module caller sees it
import { Osmotic } from 'osmotic';
import jsonl, { type JsonlPluginOptions } from '../src/index.mjs';

const options: JsonlPluginOptions = { fields: ['name'], type: 'ndjson' };
Osmotic.plugins([jsonl, jsonl(options), jsonl({ type: 'jsonl-prices', fields: ['price'] })]);

// @ts-expect-error: type is a string
jsonl({ type: 1 });
