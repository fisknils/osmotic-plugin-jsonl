import type { OsmoticPlugin } from 'osmotic';
import type { JsonlOptions, JsonlPluginOptions } from '../types/options.js';
import { JsonlWriter } from './JsonlWriter.js';

/**
 * Create the plugin. Pass it to `Osmotic.plugins()` before building chains.
 *
 * @example
 * ```ts
 * Osmotic.plugins([jsonl({ fields: ['name', 'price'] })]);
 * ```
 */
export function jsonl(options: JsonlPluginOptions = {}): OsmoticPlugin {
	const { type = 'jsonl', ...defaults } = options;
	return {
		// Plugin names are unique, so each extra type gets its own
		name: type === 'jsonl' ? 'osmotic-plugin-jsonl' : `osmotic-plugin-jsonl:${type}`,
		exporters: {
			[type]: (file: string, opts: JsonlOptions = {}) => new JsonlWriter(file, { ...defaults, ...opts }),
		},
	};
}
