import { jsonl as create } from './core/plugin.js';
import type * as types from './types/options.js';

/**
 * Export rows to JSON Lines files with `.export('jsonl', file, options)`. Load it once,
 * before building chains:
 *
 * ```js
 * Osmotic.plugins([require('osmotic-plugin-jsonl')]);
 * // or, with default options:
 * Osmotic.plugins([require('osmotic-plugin-jsonl')({ fields: ['name', 'price'] })]);
 * ```
 */
function jsonl(options?: types.JsonlPluginOptions): import('osmotic').OsmoticPlugin {
	return create(options);
}

namespace jsonl {
	export type JsonlOptions = types.JsonlOptions;
	export type JsonlPluginOptions = types.JsonlPluginOptions;
}

// module.exports is the function itself, so require() can pass it straight to plugins()
export = jsonl;
