// ESM entry: re-exports the CommonJS build, so import and require share one plugin
import jsonl from './index.cjs';

export default jsonl;
export type { JsonlOptions, JsonlPluginOptions } from './types/options.js';
