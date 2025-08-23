import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  InputBox,
  InputForm,
  OptionForm,
  PipeArrayBuffer,
  RecordForm,
  Render,
  TupleForm,
  VariantForm,
  VecForm,
  compare,
  concat,
  idlLabelToId,
  idl_exports,
  inputBox,
  lebDecode,
  lebEncode,
  optForm,
  readIntLE,
  readUIntLE,
  recordForm,
  renderInput,
  renderValue,
  safeRead,
  safeReadUint8,
  slebDecode,
  slebEncode,
  tupleForm,
  uint8Equals,
  uint8FromBufLike,
  uint8ToDataView,
  variantForm,
  vecForm,
  writeIntLE,
  writeUIntLE
} from "./chunk-R2JNNGV5.js";
import "./chunk-ZJ2KAVMQ.js";
import "./chunk-5WUIHEDG.js";
export {
  idl_exports as IDL,
  InputBox,
  InputForm,
  OptionForm,
  PipeArrayBuffer,
  RecordForm,
  Render,
  TupleForm,
  VariantForm,
  VecForm,
  compare,
  concat,
  idlLabelToId,
  inputBox,
  lebDecode,
  lebEncode,
  optForm,
  readIntLE,
  readUIntLE,
  recordForm,
  renderInput,
  renderValue,
  safeRead,
  safeReadUint8,
  slebDecode,
  slebEncode,
  tupleForm,
  uint8Equals,
  uint8FromBufLike,
  uint8ToDataView,
  variantForm,
  vecForm,
  writeIntLE,
  writeUIntLE
};
//# sourceMappingURL=@dfinity_candid.js.map
