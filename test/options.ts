import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Osmotic } from 'osmotic';
import jsonl = require('../src/index.cjs');
import { openSite, scrape, shop, tempDir } from './helpers/index.js';

before(() => Osmotic.plugins([jsonl, jsonl({ type: 'jsonl-options-prices', fields: ['price'] })]));

const products = (url: string) => Osmotic.get(url).find('.product').set({ name: 'h2', price: '.price' });

test('fields writes only those fields, in that order, and missing ones as null', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'fields.jsonl');
	await scrape(products(site.url()).export('jsonl', file, { fields: ['price', 'missing'] }));
	assert.equal(
		readFileSync(file, 'utf8'),
		'{"price":"499,00","missing":null}\n' +
			'{"price":"1 299,50","missing":null}\n' +
			'{"price":"89,00","missing":null}\n' +
			'{"price":"39,90","missing":null}\n',
	);
});

test('a second type carries its own defaults', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'prices.jsonl');
	await scrape(products(site.url()).export('jsonl-options-prices', file));
	assert.equal(
		readFileSync(file, 'utf8'),
		'{"price":"499,00"}\n{"price":"1 299,50"}\n{"price":"89,00"}\n{"price":"39,90"}\n',
	);
});

test('options passed to export() override the plugin defaults for that file', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'all.jsonl');
	await scrape(products(site.url()).export('jsonl-options-prices', file, { fields: null }));
	assert.equal(
		readFileSync(file, 'utf8'),
		'{"name":"Desk lamp, black","price":"499,00"}\n' +
			'{"name":"Lamp \\"Aurora\\"","price":"1 299,50"}\n' +
			'{"name":"Adapter E27\\\\E14\\tgrey","price":"89,00"}\n' +
			'{"name":"Glödlampa\\n2-pack","price":"39,90"}\n',
	);
});
