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

  loadTasks(query: Partial<LoadTasksQueryParams>) {
    return this.endpoint.invokeRequest<
      HelperRequestType<LoadTasksResultData[]>
    >(EndpointMethod.GET, `/tasks`, query);
  }

  addProvingTask(task: WithSignature<AddProvingTaskParams>) {
    return this.endpoint.invokeRequest<AddProvingTaskResultData>(
      EndpointMethod.POST,
      '/prove',
      task
    );
  }
}
