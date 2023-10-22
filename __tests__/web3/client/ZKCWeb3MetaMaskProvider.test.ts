import { MetaMaskInpageProvider } from '@metamask/providers';
import { providers } from 'ethers';

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
  chainId: fakerChainIdNum,
  chainName: fakerString20Fn(),
  nativeCurrency: {
    name: fakerString20Fn(),
    symbol: fakerSymbolFn(),
    decimals: 16
  },
  rpcUrls: [fakerURLFn()],
  blockExplorerUrls: [fakerURLFn()]
};
const fakerJsonRpcSigner = {
  getAddress: async () => fakerAddress
} as providers.JsonRpcSigner;

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

    const [account] = await zKCWeb3MetaMaskProvider.connect();

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

  describe('teat call sign()', () => {
    it('oldChainId === newChainId', async () => {
      const fakerSign = fakerAddressFn();

      expect.assertions(6);

      expect(mockProviderGetSigner).toHaveBeenCalledTimes(0);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(0);

      mockProviderGetSigner.mockReturnValueOnce(fakerJsonRpcSigner);
      mockEthereumRequest.mockResolvedValueOnce(fakerSign);

      // "I have 100€"  --utf8ToHex-->  "0x49206861766520313030e282ac"
      const signature = await zKCWeb3MetaMaskProvider.sign('I have 100€');
      expect(mockEthereumRequest).toHaveBeenCalledWith({
        method: 'personal_sign',
        params: ['0x49206861766520313030e282ac', fakerAddress]
      });
      expect(signature).toBe(fakerSign);
      expect(mockProviderGetSigner).toHaveBeenCalledTimes(1);
      expect(mockEthereumRequest).toHaveBeenCalledTimes(1);
    });
  });
});
