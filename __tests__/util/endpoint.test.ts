import { HTTPClient } from 'koajax';

import { EndpointMethod, ZKCEndpoint } from '../../src';
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
const fakerResObject = {
  success: true,
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

let zkcEndpoint: ZKCEndpoint;
beforeEach(() => {
  mockHTTPClientGet.mockClear();
  mockHTTPClientPost.mockClear();
  zkcEndpoint = new ZKCEndpoint(fakerBaseURI);
});

describe('ZKCEndpoint class', () => {
  it('should new ZKCEndpoint class', () => {
    expect(HTTPClient).toHaveBeenCalledWith({
      baseURI: fakerBaseURI,
      responseType: 'json'
    });
  });

  describe('test request()', () => {
    it('call with Get', async () => {
      expect.assertions(4);

      mockHTTPClientGet.mockResolvedValueOnce({ body: fakerResObject });

      expect(mockHTTPClientGet).toHaveBeenCalledTimes(0);

      const res = await zkcEndpoint.request(
        EndpointMethod.GET,
        fakerPath,
        fakerBody,
        fakerHeader
      );

      expect(mockHTTPClientGet).toHaveBeenCalledTimes(1);
      expect(mockHTTPClientGet).toHaveBeenCalledWith(
        `${fakerPath}?${new URLSearchParams(fakerBody)}`,
        fakerHeader
      );
      expect(res).toBe(fakerResObject);
    });

    it('call with Post', async () => {
      expect.assertions(4);

      mockHTTPClientPost.mockResolvedValueOnce({ body: fakerResObject });

      expect(mockHTTPClientPost).toHaveBeenCalledTimes(0);

      const res = await zkcEndpoint.request(
        EndpointMethod.POST,
        fakerPath,
        fakerBody,
        fakerHeader
      );

      expect(mockHTTPClientPost).toHaveBeenCalledTimes(1);
      expect(mockHTTPClientPost).toHaveBeenCalledWith(
        fakerPath,
        fakerBody,
        fakerHeader
      );

      expect(res).toBe(fakerResObject);
    });

    it('throw response error', async () => {
      expect.assertions(1);

      const errorMessage = fakerString20Fn();
      mockHTTPClientGet.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await zkcEndpoint.request(
          EndpointMethod.GET,
          fakerPath,
          fakerBody,
          fakerHeader
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });

    it('throw GET response error', async () => {
      expect.assertions(1);

      const errorMessage = fakerString20Fn();
      mockHTTPClientGet.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await zkcEndpoint.request(
          EndpointMethod.GET,
          fakerPath,
          fakerBody,
          fakerHeader
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });

    it('throw POST response error', async () => {
      expect.assertions(1);

      const errorMessage = fakerString20Fn();
      mockHTTPClientPost.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await zkcEndpoint.request(
          EndpointMethod.POST,
          fakerPath,
          fakerBody,
          fakerHeader
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
