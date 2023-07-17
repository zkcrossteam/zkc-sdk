import { ZKCWasmServiceUtil } from '../../src';
import { fakerAddressFn, fakerString20Fn } from '../common/faker';

describe('ZKCWasmServiceUtil class', () => {
  it('createProvingSignMessage function(user_address, md5)', () => {
    const fakerAddress = fakerAddressFn();
    const fakerMd5 = fakerString20Fn();

    const signMessage = ZKCWasmServiceUtil.createProvingSignMessage({
      user_address: fakerAddress,
      md5: fakerMd5
    });

    expect(signMessage).toBe(
      JSON.stringify({ user_address: fakerAddress, md5: fakerMd5 })
    );
  });

  it('createProvingSignMessage function(public_inputs, private_inputs)', () => {
    const fakerPublicInputs = [fakerString20Fn()];
    const fakerPrivateInputs = [fakerString20Fn()];

    const signMessage = ZKCWasmServiceUtil.createProvingSignMessage({
      public_inputs: fakerPublicInputs,
      private_inputs: fakerPrivateInputs
    });

    expect(signMessage).toBe(
      JSON.stringify({
        public_inputs: fakerPublicInputs,
        private_inputs: fakerPrivateInputs
      })
    );
  });
});
