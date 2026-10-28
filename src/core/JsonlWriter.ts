import { createWriteStream, type WriteStream } from 'node:fs';
import type { Data, Exporter } from 'osmotic';
import type { JsonlOptions } from '../types/options.js';

// JSON Lines file written one row at a time. osmotic creates it on the first row of a run.
export class JsonlWriter implements Exporter {
	private readonly stream: WriteStream;
	private readonly fields: string[] | null;
	private error: Error | null = null;

	constructor(file: string, { fields = null }: JsonlOptions) {
		this.fields = fields;
		this.stream = createWriteStream(file, { encoding: 'utf8' });
		// Unhandled, a failed open would crash the process; write() and end() report it instead
		this.stream.on('error', (err) => (this.error ??= err));
	}

	write(data: Data): void {
		if (this.error) throw this.error;
		const row = this.fields ? Object.fromEntries(this.fields.map((f) => [f, data[f] ?? null])) : data;
		// JSON.stringify escapes line breaks in values, so a row never spans lines
		this.stream.write(JSON.stringify(row) + '\n');
	}

	end(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.error) return reject(this.error); // A stream that failed to open never finishes
			this.stream.once('error', reject);
			this.stream.end((err?: Error | null) => ((err ?? this.error) ? reject(err ?? this.error) : resolve()));
		});
	}
}
