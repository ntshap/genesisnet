import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  JSON_KEY_PRINCIPAL,
  Principal,
  getCrc32
} from "./chunk-ZJ2KAVMQ.js";
import "./chunk-5WUIHEDG.js";
export {
  JSON_KEY_PRINCIPAL,
  Principal,
  getCrc32
};
//# sourceMappingURL=@dfinity_principal.js.map
