import { ZKState } from './merkle';

let wasmMemory: WebAssembly.Memory;

export function setMemory(memory: WebAssembly.Memory) {
  wasmMemory = memory;
}

const {
  merkle_address,
  merkle_setroot,
  merkle_getroot,
  merkle_set,
  merkle_get,
  poseidon_new,
  poseidon_push,
  poseidon_finalize,
  cache_set_mode,
  cache_store_data,
  cache_set_hash,
  cache_fetch_data
} = new ZKState();

export const STATE_ENV = {
  wasm_console_log: (ptr: number, len: number) => {
    console.log('Inside wasm', wasmMemory, ptr, len);
    const newBuf = wasmMemory.buffer.slice(ptr, ptr + len);
    const decoder = new TextDecoder();
    console.log('wasm_console_log: ', decoder.decode(newBuf));
  },

  wasm_dbg_char: (data: any[]) =>
    console.log('Inside wasm, char call print', data),
  merkle_address,
  merkle_setroot,
  merkle_getroot,
  merkle_set,
  merkle_get,
  cache_set_mode,
  cache_store_data,
  cache_set_hash,
  cache_fetch_data,
  poseidon_new,
  poseidon_push,
  poseidon_finalize
};
