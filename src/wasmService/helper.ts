import { buildURLData } from 'web-utility';
import { Context, HTTPClient, makeFormData } from 'koajax';

import {
  CreateTaskParams,
  TaskListQueryParams,
  Task,
  WithSignature,
  ProofDetail,
  CreateApplicationParams
} from './interface';

export const { Memory, Table } = WebAssembly;

export const DEFAULT_IMPORT = {
  global: {},
  env: {
    memory: new Memory({ initial: 10, maximum: 100 }),
    table: new Table({ initial: 0, element: 'anyfunc' }),
    abort: () => {
      console.error('abort in wasm!');
      throw new Error('Unsupported wasm api: abort');
    },
    require: (b: any) => {
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

export const ZKCWasmServiceHelperBaseURI = 'https://rpc.zkcross.org';

export class ZKCWasmServiceHelper {
  client: HTTPClient<Context>;

  constructor(public baseURI = ZKCWasmServiceHelperBaseURI) {
    this.client = new HTTPClient({
      baseURI: ZKCWasmServiceHelperBaseURI,
      responseType: 'json'
    }).use(async ({ request }, next) => {
      try {
        await next();
      } catch (error) {
        console.dir(error);
        throw error;
      }
    });
  }

  static async loadWasm(wasmFile: URL, importObject = DEFAULT_IMPORT) {
    if (!(wasmFile instanceof URL)) throw new Error('Wrong wasm file url!');

    const { instance } = await WebAssembly.instantiateStreaming(
      fetch(wasmFile),
      importObject
    );

    if (!(instance instanceof WebAssembly.Instance))
      throw new Error('Load wasm failed!');

    return instance;
  }

  /**
   * Upload wasm file
   * @param formData upload information
   * @returns application detail
   */
  createApplication(applicationData: CreateApplicationParams) {
    return this.client.post('application', makeFormData(applicationData));
  }

  /**
   * Request task list.
   * @param query request parameter
   * @returns task list
   */
  loadTasks(query: TaskListQueryParams) {
    return this.client.get<Task[]>(`task?${buildURLData(query)}`);
  }

  /**
   * create a task to prove the inputs, upload the proof to the chain.
   * @param task task information
   * @returns task status and application detail
   */
  addProvingTask(task: WithSignature<CreateTaskParams>) {
    return this.client.post<ProofDetail>('task/proof', task);
  }
}
