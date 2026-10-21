import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Osmotic } from 'osmotic';
import jsonl = require('../src/index.cjs');
import { openSite, scrape, shop, tempDir } from './helpers/index.js';

before(() => Osmotic.plugins([jsonl]));

// The file's expected content: each line as it appears in the file, followed by \n
const lines = (...l: string[]) => l.map((line) => line + '\n').join('');

test('writes one escaped JSON object per line, with no byte order mark', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'products.jsonl');
	await scrape(Osmotic.get(site.url()).find('.product').set({ name: 'h2', price: '.price' }).export('jsonl', file));
	assert.equal(
		readFileSync(file, 'utf8'),
		lines(
			String.raw`{"name":"Desk lamp, black","price":"499,00"}`,
			String.raw`{"name":"Lamp \"Aurora\"","price":"1 299,50"}`,
			String.raw`{"name":"Adapter E27\\E14\tgrey","price":"89,00"}`,
			String.raw`{"name":"Glödlampa\n2-pack","price":"39,90"}`,
		),
	);
});

test('arrays and objects are written as JSON arrays and objects', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'tags.jsonl');
	await scrape(
		Osmotic.get(site.url())
			.find('.product')
			.set({ tags: ['.tag'], details: { price: '.price' } })
			.export('jsonl', file),
	);
	assert.equal(
		readFileSync(file, 'utf8'),
		lines(
			'{"tags":["LED","Dimmable"],"details":{"price":"499,00"}}',
			'{"tags":["LED"],"details":{"price":"1 299,50"}}',
			'{"tags":[],"details":{"price":"89,00"}}',
			'{"tags":["E27"],"details":{"price":"39,90"}}',
		),
	);
});
