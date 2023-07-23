import { Context, HTTPClient } from 'koajax';
import { buildURLData } from 'web-utility';

export enum EndpointMethod {
  GET,
  POST
}

export class ZKCEndpoint {
  client: HTTPClient<Context>;

  constructor(baseURI: string) {
    this.client = new HTTPClient({ baseURI, responseType: 'json' });
  }

  /**
   * HTTP request function.
   * @param method HTTP request method
   * @param path HTTP request path
   * @param body it is the request body when it is a POST request, and the request query when it is a GET request
   * @param headers HTTP request headers
   * @returns the data body of the response data
   */
  async request<T>(
    method: EndpointMethod,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: JSON | FormData | string[][] | Record<string, any> | null,
    headers?: HeadersInit
  ) {
    try {
      if (method === EndpointMethod.GET) {
        const { body: resBody } = await this.client.get<T>(
          `${path}${body ? '?' + new URLSearchParams(buildURLData(body)) : ''}`,
          headers
        );

        return resBody;
      } else {
        const { body: resBody } = await this.client.post<T>(
          path,
          body,
          headers
        );

        return resBody;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
