import { Maybe } from '@metamask/providers/dist/utils';
import { providers } from 'ethers';

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

const ContractCalls: unknown[] = [];

const mockProviderGetNetwork = jest.fn();

const fakerWeb3Provider = {
  getNetwork: mockProviderGetNetwork
} as unknown as providers.Web3Provider;

jest.mock('ethers', () => ({
  __esModule: true,
  ...jest.requireActual('ethers'),
  Contract: class MockContract {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...data: any[]) {
      ContractCalls.push(data);
    }
  },
  providers: {
    Web3Provider: function () {
      return fakerWeb3Provider;
    }
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
    expect(ContractCalls).toHaveLength(0);
    expect(
      zKCWeb3ProviderTest.getContractWithoutSigner(fakerAddress, fakerAbi)
    ).toBeTruthy();
    expect(ContractCalls).toHaveLength(1);
    expect(ContractCalls[0]).toEqual([
      fakerAddress,
      fakerAbi,
      zKCWeb3ProviderTest.provider
    ]);
  });
});
