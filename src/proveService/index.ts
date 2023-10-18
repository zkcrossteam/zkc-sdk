import { ChainInfo, ZKCWeb3Provider } from '../web3';
import { buildURLData } from 'web-utility';
import { HTTPClient } from 'koajax';

import { ZKCClientBaseURI } from '../constant';
import {
  CreateTaskParams,
  ProofDetail,
  TaskListQueryParams,
  Task,
  WithSignature
} from '../types';

export class ZKCProveService {
  client = new HTTPClient({ responseType: 'json' });

  constructor(public baseURI = ZKCClientBaseURI) {
    this.client.baseURI = baseURI;
  }

  /**
   * create a task to prove the inputs, upload the proof to the chain.
   * @param taskInfo task information
   * @returns task status and application detail
   */
  createOne(taskInfo: WithSignature<CreateTaskParams>) {
    return this.client.post<ProofDetail>('task/proof', taskInfo);
  }

  /**
   * Request task list
   * @param query request parameter
   * @returns task list
   */
  getList(query: TaskListQueryParams) {
    return this.client.get<Task[]>(`task?${buildURLData(query)}`);
  }

  /**
   * Initialize account and network, prove and deploy task
   * @param userAddress userAddress already been connected
   */
  async settlement(
    provider: ZKCWeb3Provider,
    taskInfo: Omit<CreateTaskParams, 'user_address'>,
    userAddress?: string,
    chainInfo?: ChainInfo
  ) {
    try {
      const account = await provider.checkAccount(userAddress);
      const user_address = account.toLowerCase();

      await provider.switchNet(chainInfo);

      const messageString = JSON.stringify({ user_address, ...taskInfo });

      const signature = await provider.sign(messageString);

      return this.createOne({ ...taskInfo, signature, user_address });
    } catch (error) {
      console.dir(error);
      throw error;
    }
  }
}
