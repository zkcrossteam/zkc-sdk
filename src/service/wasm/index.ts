import { makeFormData } from 'koajax';
import type {} from 'lodash';
import memoize from 'lodash.memoize';
import { buildURLData } from 'web-utility';

import {
  DeployWasmApplicationParams,
  ProofDetail,
  Task,
  WasmApplicationListQueryParams
} from '../../types';
import { ZKCService } from '..';
import { setMemory, STATE_ENV } from '../state';
export const { Memory, Table } = WebAssembly;
export interface InstanceExport<T extends WebAssembly.Exports> {
  exports: T;
}
export const BASE_ENV = {
  memory: new Memory({ initial: 10, maximum: 100 }),
  table: new Table({ initial: 0, element: 'anyfunc' }),
  abort: () => {
    throw new Error('Unsupported wasm api: abort');
  },
  require: (b: boolean) => {
    console.log('Inside wasm: require call(1 means succ!)', b);
    if (!b) throw new Error('Require failed');
  },
  wasm_input: () => {
    console.error('wasm_input should not been called in non-zkwasm mode');
    throw new Error('Unsupported wasm api: wasm_input');
  },
  wasm_dbg: (a: number) => {
    console.log('Inside wasm, dbg: ', a);
  }
};
export const DEFAULT_IMPORT = {
  global: {},
  env: { ...BASE_ENV, ...STATE_ENV }
};

async function instantiateStreamingWasm<T extends WebAssembly.Exports>(
  wasmFile: URL,
  importObject = DEFAULT_IMPORT
) {
  if (!(wasmFile instanceof URL)) throw new Error('Wrong wasm file url!');

  const { instance } = await WebAssembly.instantiateStreaming(
    fetch(wasmFile),
    importObject
  );

  const memory = instance.exports.memory as WebAssembly.Memory;

  setMemory(memory);

  if (!(instance instanceof WebAssembly.Instance))
    throw new Error('Load wasm failed!');

  return instance as InstanceExport<T>;
}
export class ZKCWasmService extends ZKCService {
  static loadWasm = memoize(instantiateStreamingWasm);
  /**
   * Deploy wasm application
   * @param applicationData upload information
   * @returns application detail
   */
  deployWasm(applicationData: DeployWasmApplicationParams) {
    return this.client.post<ProofDetail>(
      'application',
      makeFormData(applicationData)
    );
  }

  getWasmApplications(query: WasmApplicationListQueryParams) {
    return this.client.get<Task[]>(`application?${buildURLData(query)}`);
  }
}
