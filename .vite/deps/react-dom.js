import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  require_react_dom
} from "./chunk-A3JIZIFX.js";
import "./chunk-5TCXHJUI.js";
import "./chunk-5WUIHEDG.js";
export default require_react_dom();
//# sourceMappingURL=react-dom.js.map
