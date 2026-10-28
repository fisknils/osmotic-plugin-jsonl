import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Osmotic } from 'osmotic';
import jsonl = require('../src/index.cjs');
import { openSite, scrape, shop, tempDir } from './helpers/index.js';

before(() => Osmotic.plugins([jsonl]));

const prices = (url: string, file: string) =>
	Osmotic.get(url).find('.product').set({ price: '.price' }).export('jsonl', file);

test('each run starts the file over', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'prices.jsonl');
	const chain = prices(site.url(), file);
	await scrape(chain);
	await scrape(chain);
	assert.equal(
		readFileSync(file, 'utf8'),
		'{"price":"499,00"}\n{"price":"1 299,50"}\n{"price":"89,00"}\n{"price":"39,90"}\n',
	);
});

test('a file that cannot be opened fails the run instead of crashing', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'missing-dir', 'prices.jsonl');
	await assert.rejects(scrape(prices(site.url(), file)), /ENOENT/);
});
