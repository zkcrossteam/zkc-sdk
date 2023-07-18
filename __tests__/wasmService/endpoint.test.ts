import { HTTPClient } from 'koajax';

import { EndpointMethod, ZKCWasmServiceEndpoint } from '../../src';
import { fakerObjectFn, fakerString20Fn, fakerURLFn } from '../common/faker';

const fakerBaseURI = fakerURLFn();
const fakerPath = '/' + fakerString20Fn();
const fakerBody = {
  ...fakerObjectFn(),
  ...fakerObjectFn()
};
const fakerHeader = {
  ...fakerObjectFn()
};

const mockHTTPClientGet = jest.fn();
const mockHTTPClientPost = jest.fn();
const fakerHTTPClient = {
  get: mockHTTPClientGet,
  post: mockHTTPClientPost
};

jest.mock('koajax', () => ({
  __esModule: true,
  ...jest.requireActual('koajax'),
  HTTPClient: jest.fn().mockImplementation(() => fakerHTTPClient)
}));

let zkcWasmServiceEndpoint: ZKCWasmServiceEndpoint;
beforeEach(() => {
  mockHTTPClientGet.mockClear();
  mockHTTPClientPost.mockClear();
  zkcWasmServiceEndpoint = new ZKCWasmServiceEndpoint(fakerBaseURI);
});

describe('ZKCWasmServiceEndpoint class', () => {
  it('should new ZKCWasmServiceEndpoint class', () => {
    expect(HTTPClient).toHaveBeenCalledWith({
      baseURI: fakerBaseURI,
      responseType: 'json'
    });
  });

  describe('test getJSONResponse()', () => {
    it('success = true', () => {
      const fakerRes = {
        success: true,
        result: fakerObjectFn()
      };

      expect(zkcWasmServiceEndpoint.getJSONResponse(fakerRes)).toBe(
        fakerRes.result
      );
    });

    it('success = false', () => {
      const errorMessage = fakerString20Fn();
      const fakerRes = {
        success: false,
        error: new Error(errorMessage)
      };

      try {
        zkcWasmServiceEndpoint.getJSONResponse(fakerRes);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('test invokeRequest()', () => {
    it('prepareRequest() return result with success is true', async () => {
      expect.assertions(1);

      const fakerRes = {
        success: true,
        result: fakerObjectFn()
      };

      mockHTTPClientGet.mockResolvedValueOnce({ body: fakerRes });

      const res = await zkcWasmServiceEndpoint.invokeRequest(
        EndpointMethod.GET,
        fakerPath,
        fakerBody,
        fakerHeader
      );

      expect(res).toBe(fakerRes.result);
    });

    it('prepareRequest() return result with result is false', async () => {
      expect.assertions(1);

      const errorMessage = fakerString20Fn();
      const fakerRes = {
        success: false,
        error: new Error(errorMessage)
      };

      mockHTTPClientGet.mockResolvedValueOnce({ body: fakerRes });

      try {
        await zkcWasmServiceEndpoint.invokeRequest(
          EndpointMethod.GET,
          fakerPath,
          fakerBody,
          fakerHeader
        );
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });

    it('prepareRequest() throw Error', async () => {
      expect.assertions(1);

      const fakerResError =
        'Query deserialize error: duplicate field `tasktype`';

      mockHTTPClientGet.mockRejectedValueOnce(new Error(fakerResError));

      try {
        await zkcWasmServiceEndpoint.invokeRequest(
          EndpointMethod.GET,
          fakerPath,
          fakerBody,
          fakerHeader
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(fakerResError);
      }
    });
  });
});
