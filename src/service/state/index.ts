import { ZKCStateURI } from '../config';
import { ZKState } from './merkle';

export * from './merkle';

let wasmMemory: WebAssembly.Memory;

export function setMemory(memory: WebAssembly.Memory) {
  wasmMemory = memory;
}

export function getStateEnv(baseURI = ZKCStateURI) {
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
  } = new ZKState(baseURI);

  return {
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
  };
}

let _print_buf: number[] = [];

function print_result(): void {
  // Convert the array of numbers to a string
  const result = String.fromCharCode(..._print_buf);

  _print_buf = [];

  console.log(result);
}

export const LOG_ENV = {
  wasm_console_log: (ptr: number, len: number) => {
    console.log('Inside wasm', wasmMemory, ptr, len);
    const newBuf = wasmMemory.buffer.slice(ptr, ptr + len);
    const decoder = new TextDecoder();
    console.log('wasm_console_log: ', decoder.decode(newBuf));
  },
  /**
   * - Convert the number to a character
   * - Check if the character is a newline
   * - Print the accumulated result when encountering a newline
   * - Append the character to the print buffer
   */
  wasm_dbg_char: (data: bigint) =>
    String.fromCharCode(Number(data)) === '\n'
      ? print_result()
      : _print_buf.push(Number(data)),
  wasm_dbg: (a: number) => {
    console.log('Inside wasm, dbg: ', a);
  }
};
