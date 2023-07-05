import { MetaMaskInpageProvider } from '@metamask/providers';
import { ethErrors } from 'eth-rpc-errors';
import { BigNumber, providers } from 'ethers';

import { ZKCWeb3MetaMaskProvider } from '../../../src';
import {
  fakerAddressFn,
  fakerChainIdNumFn,
  fakerEventNameFn,
  fakerString20Fn,
  fakerSymbolFn,
  fakerURLFn
} from '../../common/faker';

const fakerAddress = fakerAddressFn();
const fakerChainIdNum = fakerChainIdNumFn();
const fakerNewChainInfo = {
  chainId: BigNumber.from(fakerChainIdNum).toHexString(),
  chainName: fakerString20Fn(),
  nativeCurrency: {
    name: fakerString20Fn(),
    symbol: fakerSymbolFn(),
    decimals: 16
  },
  rpcUrls: [fakerURLFn()],
  blockExplorerUrls: [fakerURLFn()]
};
const fakerJsonRpcSigner = {} as providers.JsonRpcSigner;

const mockEthereumRequest = jest.fn();
const fakerEthereum = {
  request: mockEthereumRequest
} as unknown as MetaMaskInpageProvider;

const mockProviderGetNetwork = jest.fn();
const mockProviderGetSigner = jest.fn();
const mockEthereumOn = jest.fn();
const fakerWeb3Provider = {
  getNetwork: mockProviderGetNetwork,
  getSigner: mockProviderGetSigner,
  on: mockEthereumOn
} as unknown as providers.Web3Provider;

jest.mock('ethers', () => ({
  __esModule: true,
  ...jest.requireActual('ethers'),
  providers: {
    Web3Provider: () => fakerWeb3Provider
  }
}));

let zKCWeb3MetaMaskProvider: ZKCWeb3MetaMaskProvider;

beforeEach(() => {
  mockEthereumRequest.mockClear();
  mockProviderGetNetwork.mockClear();
  mockProviderGetSigner.mockClear();
  mockEthereumOn.mockClear();
  window.ethereum = fakerEthereum;
  zKCWeb3MetaMaskProvider = new ZKCWeb3MetaMaskProvider();
});

describe('ZKCWeb3MetaMaskProvider class', () => {
  describe('test new ZKCWeb3MetaMaskProvider class', () => {
    it('Normal', () => {
      expect(zKCWeb3MetaMaskProvider.externalProvider).toBe(fakerEthereum);
      expect(1).toBe(1);
    });

    it('window.ethereum = undefined, Error', () => {
      window.ethereum = undefined;
      expect(() => new ZKCWeb3MetaMaskProvider()).toThrowError(
        'MetaMask not installed, Browser mode is not available.'
      );
    });
  });

  it('teat call connect()', async () => {
    expect.assertions(4);
    mockEthereumRequest.mockResolvedValueOnce([fakerAddress]);
    expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

    const account = await zKCWeb3MetaMaskProvider.connect();

    expect(mockEthereumRequest).toHaveBeenCalledTimes(1);
    expect(mockEthereumRequest).toHaveBeenCalledWith({
      method: 'eth_requestAccounts'
    });
    expect(account).toBe(fakerAddress);
  });

  describe('teat call switchNet()', () => {
    it('oldChainId === newChainId', async () => {
      expect.assertions(5);

      mockProviderGetNetwork.mockResolvedValueOnce({
        name: fakerNewChainInfo.chainName,
        chainId: fakerChainIdNum,
        ensAddress: fakerAddress
      });

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      expect(
        await zKCWeb3MetaMaskProvider.switchNet(fakerNewChainInfo)
      ).toBeUndefined();

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(1);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);
    });

    it('oldChainId !== newChainId, the new network exists in the network list', async () => {
      expect.assertions(5);

      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum + 1
      });
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum
      });

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      await zKCWeb3MetaMaskProvider.switchNet(fakerNewChainInfo);

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(2);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(1);
      expect(mockEthereumRequest).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(fakerChainIdNum).toHexString() }]
      });
    });

    it('oldChainId !== newChainId, the new network does not exist in the network list', async () => {
      expect.assertions(7);

      const switchError = ethErrors.provider.custom({
        code: 4902,
        message: 'switchError'
      });
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum + 1
      });
      mockEthereumRequest.mockRejectedValueOnce(switchError);
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum
      });

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      await zKCWeb3MetaMaskProvider.switchNet(fakerNewChainInfo);

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(2);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(3);
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(1, {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(fakerChainIdNum).toHexString() }]
      });
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(2, {
        method: 'wallet_addEthereumChain',
        params: [fakerNewChainInfo]
      });
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(3, {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(fakerChainIdNum).toHexString() }]
      });
    });

    it('oldChainId !== newChainId, other errors occurred while switching the network', async () => {
      expect.assertions(5);

      const switchError = ethErrors.provider.custom({
        code: 4901,
        message: 'switchError'
      });
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum + 1
      });
      mockEthereumRequest.mockRejectedValueOnce(switchError);

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      try {
        await zKCWeb3MetaMaskProvider.switchNet(fakerNewChainInfo);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toBe(
          `Can not switch to chain ${fakerNewChainInfo.chainId}.`
        );
      }
      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(1);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(1);
    });

    it('oldChainId !== newChainId, An error occurred while adding network', async () => {
      expect.assertions(7);

      const switchError = ethErrors.provider.custom({
        code: 4902,
        message: 'switchError'
      });
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum + 1
      });
      mockEthereumRequest.mockRejectedValueOnce(switchError);
      mockEthereumRequest.mockRejectedValueOnce(new Error());

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      try {
        await zKCWeb3MetaMaskProvider.switchNet(fakerNewChainInfo);
      } catch (error: any) {
        expect(error.message).toBe('Add Network Rejected by User.');
      }
      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(1);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(2);
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(1, {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(fakerChainIdNum).toHexString() }]
      });
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(2, {
        method: 'wallet_addEthereumChain',
        params: [fakerNewChainInfo]
      });
    });

    it('oldChainId !== newChainId, An error occurred while switching the network again', async () => {
      expect.assertions(8);

      const switchError = ethErrors.provider.custom({
        code: 4902,
        message: 'switchError'
      });
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum + 1
      });
      mockEthereumRequest.mockRejectedValueOnce(switchError);
      mockEthereumRequest.mockResolvedValueOnce('');
      mockEthereumRequest.mockRejectedValueOnce(new Error());
      mockProviderGetNetwork.mockResolvedValueOnce({
        chainId: fakerChainIdNum
      });

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      try {
        await zKCWeb3MetaMaskProvider.switchNet(fakerNewChainInfo);
      } catch (error: any) {
        expect(error.message).toBe('Add Network Rejected by User.');
      }

      expect(mockProviderGetNetwork).toHaveBeenCalledTimes(1);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(3);
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(1, {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(fakerChainIdNum).toHexString() }]
      });
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(2, {
        method: 'wallet_addEthereumChain',
        params: [fakerNewChainInfo]
      });
      expect(mockEthereumRequest).toHaveBeenNthCalledWith(3, {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(fakerChainIdNum).toHexString() }]
      });
    });
  });

  it('test call subscribeEvent()', () => {
    expect(mockEthereumOn).toHaveBeenCalledTimes(0);

    const fakerEventName = fakerEventNameFn();
    const mockCb = jest.fn();

    zKCWeb3MetaMaskProvider.subscribeEvent(fakerEventName, mockCb);

    expect(mockEthereumOn).toHaveBeenCalledTimes(1);
    expect(mockEthereumOn).toHaveBeenCalledWith(fakerEventName, mockCb);
  });

  it('test call onAccountsChanged()', () => {
    expect(mockEthereumOn).toHaveBeenCalledTimes(0);

    const mockCb = jest.fn();

    zKCWeb3MetaMaskProvider.onAccountsChanged(mockCb);

    expect(mockEthereumOn).toHaveBeenCalledTimes(1);
  });

  it('test call getZKCWeb3JsonRpcSigner()', () => {
    expect(mockProviderGetSigner).toHaveBeenCalledTimes(0);

    mockProviderGetSigner.mockReturnValueOnce(fakerJsonRpcSigner);

    expect(zKCWeb3MetaMaskProvider.getZKCWeb3JsonRpcSigner().signer).toBe(
      fakerJsonRpcSigner
    );
    expect(mockProviderGetSigner).toHaveBeenCalledTimes(1);
    expect(mockProviderGetSigner).toHaveBeenCalledWith();
  });
});
