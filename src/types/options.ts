// Declared here, in a file both entry points' declarations import, so callers get it
declare module 'osmotic' {
	interface ExportTypes {
		/**
		 * A JSON Lines file, one JSON object per line.
		 *
		 * @example
		 * ```ts
		 * .export('jsonl', 'products.jsonl', { fields: ['name', 'price'] })
		 * ```
		 */
		jsonl: JsonlOptions;
	}
}

/**
 * How a JSON Lines file is written: UTF-8 without a byte order mark, each row as one
 * line of JSON ending in `\n`.
 */
export interface JsonlOptions {
	/**
	 * The fields to write, in that order. Fields missing from a row are written as
	 * `null`, so every line has the same keys.
	 * @defaultValue every field of each row, as is
	 */
	fields?: string[] | null;
}

/** Options for the plugin. JSON Lines options set here are the defaults for every export. */
export interface JsonlPluginOptions extends JsonlOptions {
	/**
	 * The export type to register. Load the plugin again under another type for a second
	 * set of defaults, e.g. `jsonl({ type: 'jsonl-prices', fields: ['name', 'price'] })`.
	 * Declare a type other than `'jsonl'` in `ExportTypes` to have its options checked.
	 * @defaultValue `'jsonl'`
	 */
	type?: string;
}
