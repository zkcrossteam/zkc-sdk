/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTPClient } from 'koajax';

import { ZKCClientBaseURI } from '../constant';

export abstract class ZKCService {
  client = new HTTPClient({ responseType: 'json' });

  constructor(public baseURI = ZKCClientBaseURI) {
    this.client.baseURI = baseURI;
  }
}

export function logData(_target: any, key: string, meta: PropertyDescriptor) {
  const origin: (...data: any[]) => Promise<any> = meta.value;

  meta.value = async function (...data: any[]) {
    console.debug(`${key} begin Input:`, data);
    console.debug(`${key} Context:`, this);
    try {
      const result = await origin.apply(this, data);
      console.debug(`${key} end Output:`, JSON.stringify(result));
      return result;
    } catch (error) {
      console.debug(`${key} Error:`, error);
      throw error;
    }
  };
}
