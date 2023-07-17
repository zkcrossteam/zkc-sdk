import { ProvingParams } from './interface';

export class ZKCWasmServiceUtil {
  static createProvingSignMessage(params: Partial<ProvingParams>) {
    return JSON.stringify(params);
  }
}
