// The jsonl export type's options, as a CommonJS caller sees them
import { Osmotic } from 'osmotic';
import jsonl = require('../src/index.cjs');

const options: jsonl.JsonlOptions = { fields: ['a', 'b'] };
new Osmotic().get('https://example.com').export('jsonl', 'out.jsonl', options).export('jsonl', 'other.jsonl');
new Osmotic().export('jsonl', 'out.jsonl', { fields: null });

// @ts-expect-error: fields is a list of field names
new Osmotic().export('jsonl', 'out.jsonl', { fields: 'a' });

// @ts-expect-error: unknown option
new Osmotic().export('jsonl', 'out.jsonl', { pretty: true });
