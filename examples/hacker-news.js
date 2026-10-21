const { Osmotic } = require('osmotic');

Osmotic.plugins([require('../dist/index.cjs')]);

Osmotic.get('https://news.ycombinator.com')
	.find('tr.athing')
	.set({ rank: '.rank', title: '.titleline > a', link: '.titleline > a@href' })
	.export('jsonl', 'hacker-news.jsonl')
	.config({ maxPages: 1 })
	.run();
