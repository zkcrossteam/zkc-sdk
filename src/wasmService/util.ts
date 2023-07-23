import { ProvingParams } from './interface';

export class ZKCWasmServiceUtil {
  /**
   * Convert task information to a string.
   * @param params task information
   * @returns task information string
   */
  static createProvingSignMessage(params: Partial<ProvingParams>) {
    return JSON.stringify(params);
  }
}
