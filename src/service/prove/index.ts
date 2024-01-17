import { buildURLData } from 'web-utility';

import {
  CreateTaskParams,
  ProofDetail,
  Task,
  TaskListQueryParams,
  WithSignature
} from '../../types';
import { ChainInfo, ZKCWeb3Provider } from '../../web3';
import { ZKCService } from '..';

export class ZKCProveService extends ZKCService {
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
    const account = await provider.checkAccount(userAddress);
    const user_address = account.toLowerCase();

    await provider.switchNet(chainInfo);

    const data = { ...taskInfo, user_address };
    const signature = await provider.sign(JSON.stringify(data));

    return this.createOne({ ...data, signature });
  }
}
