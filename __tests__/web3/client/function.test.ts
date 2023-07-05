import { MetaMaskInpageProvider } from '@metamask/providers';

import { withZKCWeb3MetaMaskProvider } from '../../../src';

describe('test withZKCWeb3MetaMaskProvider function', () => {
  it('should call callBack()', async () => {
    expect.assertions(3);

    const mockCallBack = jest.fn();
    const mockEthereumRequest = jest.fn();
    mockEthereumRequest.mockResolvedValueOnce([]);
    window.ethereum = {
      request: mockEthereumRequest
    } as unknown as MetaMaskInpageProvider;

    expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

    await withZKCWeb3MetaMaskProvider<void>(mockCallBack);

    expect(mockEthereumRequest).toHaveBeenCalledTimes(1);
    expect(mockCallBack).toHaveBeenCalledTimes(1);
  });
});
