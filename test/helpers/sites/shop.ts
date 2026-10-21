import type { SitePage } from '../create-site.js';

// A small web shop with the values a real one has and JSON has to escape: names with
// quotes, backslashes, tabs and line breaks, and text outside ASCII. Every product is on
// one page, so rows reach the exporter in order.

interface Product {
	name: string;
	price: string;
	tags: string[];
}

export const products: Product[] = [
	{ name: 'Desk lamp, black', price: '499,00', tags: ['LED', 'Dimmable'] },
	{ name: 'Lamp "Aurora"', price: '1 299,50', tags: ['LED'] },
	{ name: 'Adapter E27\\E14\tgrey', price: '89,00', tags: [] },
	{ name: 'Glödlampa\n2-pack', price: '39,90', tags: ['E27'] },
];

const item = (p: Product) => `
	<li class="product">
		<h2>${p.name}</h2>
		<span class="price">${p.price}</span>
		<ul class="tags">${p.tags.map((t) => `<li class="tag">${t}</li>`).join('')}</ul>
	</li>`;

export const shop: Record<string, SitePage> = {
	'/': `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Lamp Shop</title></head>
<body>
	<ul class="products">${products.map(item).join('')}
	</ul>
</body>
</html>`,
};
