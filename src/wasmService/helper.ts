import { EndpointMethod } from '../util';
import { ZKCWasmServiceEndpoint } from './endpoint';
import {
  AddProvingTaskParams,
  AddProvingTaskResultData,
  HelperRequestType,
  LoadTasksQueryParams,
  LoadTasksResultData,
  WithSignature
} from './interface';

export class ZKCWasmServiceHelper {
  public endpoint: ZKCWasmServiceEndpoint;

  constructor(baseURI: string) {
    this.endpoint = new ZKCWasmServiceEndpoint(baseURI);
  }

  /**
   * Request task list.
   * @param query request parameter
   * @returns task list
   */
  loadTasks(query: LoadTasksQueryParams) {
    return this.endpoint.invokeRequest<
      HelperRequestType<LoadTasksResultData[]>
    >(EndpointMethod.GET, `/task`, query);
  }

  /**
   * Add task request.
   * @param task task information
   * @returns task id and image id
   */
  addProvingTask(task: WithSignature<AddProvingTaskParams>) {
    return this.endpoint.invokeRequest<AddProvingTaskResultData>(
      EndpointMethod.POST,
      '/task/proof',
      task
    );
  }
}
