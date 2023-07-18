import { EndpointMethod, ZKCEndpoint } from '../util';

export type WasmServicePreResInterface<T> = {
  success: boolean;
} & T;

export type WasmServicePreResType<T = unknown> = WasmServicePreResInterface<{
  result?: T;
  error?: Error;
}>;

export class ZKCWasmServiceEndpoint extends ZKCEndpoint {
  getJSONResponse<T = unknown>(json: WasmServicePreResType<T>) {
    if (json.success) return json.result;

    throw new Error(json.error?.message);
  }

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
