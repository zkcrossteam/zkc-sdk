import {
  EndpointMethod,
  QueryParamsTaskStatusEnum,
  QueryParamsTaskTypeEnum,
  ZKCWasmServiceEndpoint,
  ZKCWasmServiceHelper
} from '../../src';
import {
  fakerAddressFn,
  fakerDataTotal,
  fakerObjectFn,
  fakerString20Fn,
  fakerURLFn
} from '../common/faker';

const fakerBaseURI = fakerURLFn();
const fakerUserAddress = fakerAddressFn();
const fakerMd5 = fakerAddressFn();
const fakerId = fakerString20Fn();

const mockServiceEndpointInvokeRequest = jest.fn();

const fakerEndpoint = {
  invokeRequest: mockServiceEndpointInvokeRequest
} as unknown as ZKCWasmServiceEndpoint;

jest.mock('../../src/wasmService/endpoint', () => ({
  __esModule: true,
  ...jest.requireActual('../../src/wasmService/endpoint'),
  ZKCWasmServiceEndpoint: () => fakerEndpoint
}));

let zkcWasmServiceHelper: ZKCWasmServiceHelper;
beforeEach(() => {
  mockServiceEndpointInvokeRequest.mockClear();

  zkcWasmServiceHelper = new ZKCWasmServiceHelper(fakerBaseURI);
});

describe('ZKCWasmServiceHelper class', () => {
  it('should new ZKCWasmServiceHelper class', () => {
    const newFakerEndpoint = {} as ZKCWasmServiceEndpoint;

    expect(zkcWasmServiceHelper.endpoint).toBe(fakerEndpoint);
    expect(zkcWasmServiceHelper.endpoint).not.toBe(newFakerEndpoint);

    zkcWasmServiceHelper.endpoint = newFakerEndpoint;

    expect(zkcWasmServiceHelper.endpoint).toBe(newFakerEndpoint);
  });

  describe('test loadTasks()', () => {
    it('call with user_address, md5, id', async () => {
      expect.assertions(4);
      const fakerQuery = {
        user_address: fakerUserAddress,
        md5: fakerMd5,
        id: fakerId
      };
      const fakerReturnValue = {
        data: [fakerObjectFn()],
        total: fakerDataTotal()
      };

      mockServiceEndpointInvokeRequest.mockResolvedValueOnce(fakerReturnValue);
      expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledTimes(0);

      const res = await zkcWasmServiceHelper.loadTasks(fakerQuery);

      expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledTimes(1);
      expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledWith(
        EndpointMethod.GET,
        `/tasks`,
        fakerQuery
      );
      expect(res).toEqual(fakerReturnValue);
    });

    it('call with tasktype, taskstatus, start, total', async () => {
      expect.assertions(4);
      const fakerQuery = {
        tasktype: QueryParamsTaskTypeEnum.BATCH,
        taskstatus: QueryParamsTaskStatusEnum.DONE,
        start: 0,
        total: fakerDataTotal()
      };
      const fakerReturnValue = {
        data: [fakerObjectFn()],
        total: fakerDataTotal()
      };

      mockServiceEndpointInvokeRequest.mockResolvedValueOnce(fakerReturnValue);
      expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledTimes(0);

      const res = await zkcWasmServiceHelper.loadTasks(fakerQuery);

      expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledTimes(1);
      expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledWith(
        EndpointMethod.GET,
        `/tasks`,
        fakerQuery
      );
      expect(res).toEqual(fakerReturnValue);
    });
  });

  it('call addProvingTask() with md5, public_inputs, private_inputs, user_address, signature', async () => {
    expect.assertions(4);
    const fakerBody = {
      md5: fakerMd5,
      public_inputs: [fakerString20Fn()],
      private_inputs: [fakerString20Fn()],
      user_address: fakerUserAddress,
      signature: fakerString20Fn()
    };
    const fakerReturnValue = {
      data: [fakerObjectFn()],
      total: fakerDataTotal()
    };

    mockServiceEndpointInvokeRequest.mockResolvedValueOnce(fakerReturnValue);
    expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledTimes(0);

    const res = await zkcWasmServiceHelper.addProvingTask(fakerBody);

    expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledTimes(1);
    expect(mockServiceEndpointInvokeRequest).toHaveBeenCalledWith(
      EndpointMethod.POST,
      `/prove`,
      fakerBody
    );
    expect(res).toEqual(fakerReturnValue);
  });
});
