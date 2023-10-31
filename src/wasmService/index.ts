import { makeFormData } from 'koajax';
import { buildURLData } from 'web-utility';

import { ZKCService, logData } from '../service';
import {
  DeployWasmApplicationParams,
  ProofDetail,
  Task,
  WasmApplicationListQueryParams
} from '../types';

export const { Memory, Table } = WebAssembly;

export interface InstanceExport<T extends WebAssembly.Exports> {
  exports: T;
}

export const DEFAULT_IMPORT = {
  global: {},
  env: {
    memory: new Memory({ initial: 10, maximum: 100 }),
    table: new Table({ initial: 0, element: 'anyfunc' }),
    abort: () => {
      console.error('abort in wasm!');
      throw new Error('Unsupported wasm api: abort');
    },
    require: (b: unknown) => {
      if (!b) {
        console.error('require failed');
        throw new Error('Require failed');
      }
    },
    wasm_input: () => {
      console.error('wasm_input should not been called in non-zkwasm mode');
      throw new Error('Unsupported wasm api: wasm_input');
    }
  }
};

export class ZKCWasmService extends ZKCService {
  static async loadWasm<T extends WebAssembly.Exports>(
    wasmFile: URL,
    importObject = DEFAULT_IMPORT
  ) {
    if (!(wasmFile instanceof URL)) throw new Error('Wrong wasm file url!');

    const { instance } = await WebAssembly.instantiateStreaming(
      fetch(wasmFile),
      importObject
    );

    if (!(instance instanceof WebAssembly.Instance))
      throw new Error('Load wasm failed!');

    return instance as InstanceExport<T>;
  }

  /**
   * Deploy wasm application
   * @param applicationData upload information
   * @returns application detail
   */
  @logData
  deployWasm(applicationData: DeployWasmApplicationParams) {
    return this.client.post<ProofDetail>(
      'application',
      makeFormData(applicationData)
    );
  }

  @logData
  getWasmApplications(query: WasmApplicationListQueryParams) {
    return this.client.get<Task[]>(`application?${buildURLData(query)}`);
  }
}
