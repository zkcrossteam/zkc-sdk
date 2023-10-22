import { Maybe } from '@metamask/providers/dist/utils';
import { Contract, providers } from 'ethers';

import { ZKCWeb3Provider } from '../../../src';
import { fakerAddressFn } from '../../common/faker';

class ZKCWeb3ProviderTest extends ZKCWeb3Provider {
  connect(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  switchNet<T>(): Promise<Maybe<T>> {
    throw new Error('Method not implemented.');
  }
  sign(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  checkAccount(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

const fakerExternalProvider = {} as
  | providers.ExternalProvider
  | providers.JsonRpcFetchFunc;
const fakerAddress = fakerAddressFn();
const fakerAbi = ['function name() view returns (string)'];

const mockProviderGetNetwork = jest.fn();
const mockContractConstructor = jest.fn();
const fakerWeb3Provider = {
  getNetwork: mockProviderGetNetwork
} as unknown as providers.Web3Provider;

jest.mock('ethers', () => ({
  __esModule: true,
  ...jest.requireActual('ethers'),
  Contract: jest.fn().mockImplementation(() => ({
    constructor: mockContractConstructor
  })),
  providers: {
    Web3Provider: () => fakerWeb3Provider
  }
}));

let zKCWeb3ProviderTest: ZKCWeb3ProviderTest;

beforeAll(() => {
  zKCWeb3ProviderTest = new ZKCWeb3ProviderTest(fakerExternalProvider);
});

describe('ZKCWeb3Provider class', () => {
  it('test new ZKCWeb3ProviderTest class, and get provider()', () => {
    expect(zKCWeb3ProviderTest).toBeTruthy();
    expect(zKCWeb3ProviderTest.provider).toBe(fakerWeb3Provider);
  });

  it('test getNetwork()', async () => {
    expect.assertions(2);
    expect(mockProviderGetNetwork).toHaveBeenCalledTimes(0);
    await zKCWeb3ProviderTest.getNetwork();
    expect(mockProviderGetNetwork).toHaveBeenCalledTimes(1);
  });

  it('test getContractWithoutSigner()', () => {
    expect(Contract).toBeCalledTimes(0);
    expect(
      zKCWeb3ProviderTest.getContractWithoutSigner(fakerAddress, fakerAbi)
    ).toBeTruthy();
    expect(Contract).toBeCalledTimes(1);
    expect(Contract).toHaveBeenCalledWith(
      fakerAddress,
      fakerAbi,
      zKCWeb3ProviderTest.provider
    );
  });
});
