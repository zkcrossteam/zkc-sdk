import { EndpointMethod, ZKCEndpoint } from '../util';

export type WasmServicePreResInterface<T> = {
  success: boolean;
} & T;

export type WasmServicePreResType<T = unknown> = WasmServicePreResInterface<{
  result?: T;
  error?: Error;
}>;

export class ZKCWasmServiceEndpoint extends ZKCEndpoint {
  /**
   * Parse the response data from the data body of the request response data.
   * @param json the data body of the request response data
   * @returns the request response data
   */
  getJSONResponse<T = unknown>(json: WasmServicePreResType<T>) {
    if (json.success) return json.result;

    throw new Error(json.error?.message);
  }

  /**
   * Wasm Service HTTP request function
   * @param method HTTP request method
   * @param path HTTP request path
   * @param body it is the request body when it is a POST request, and the request query when it is a GET request
   * @param headers HTTP request headers
   * @returns the request response data
   */
  async invokeRequest<T>(
    method: EndpointMethod,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: JSON | FormData | string[][] | Record<string, any> | null,
    headers?: Record<string, string>
  ) {
    return this.getJSONResponse(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (await this.request<WasmServicePreResType<T>>(
        method,
        path,
        body,
        headers
      ))!
    );
  }
}
