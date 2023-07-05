import { Provider } from '@ethersproject/abstract-provider';
import { Contract, ContractInterface, providers, Signer } from 'ethers';

import { ZKCWeb3JsonRpcSigner } from '../../../src/web3/client';
import { fakerAddressFn, fakerChainIdNumFn } from '../../common/faker';

const fakerProvider = {} as Provider;
const fakerChainIdNum = fakerChainIdNumFn();
const fakerAddress = fakerAddressFn();
const fakerAbi = ['function name() view returns (string)'];

const mockSignerGetAddress = jest.fn();
const mockSignerConnect = jest.fn();
const mockSignerGetChainId = jest.fn();

const fakerSigner = {
  provider: {},
  getAddress: mockSignerGetAddress,
  getChainId: mockSignerGetChainId,
  connect: mockSignerConnect
} as unknown as providers.JsonRpcSigner;

const fakeWeb3Provider = {
  getSigner: () => fakerSigner
} as providers.Web3Provider;

const contractConstructor = jest.fn(
  (
    address: string,
    abi: ContractInterface,
    signerOrProvider?: Signer | Provider
  ) => ({ address, abi, signerOrProvider })
);

jest.mock('ethers', () => ({
  __esModule: true,
  ...jest.requireActual('ethers'),
  Contract: jest.fn().mockImplementation(() => ({
    constructor: contractConstructor
  }))
}));

let zKCWeb3JsonRpcSigner: ZKCWeb3JsonRpcSigner;

beforeEach(() => {
  mockSignerGetAddress.mockClear();
  mockSignerConnect.mockClear();
  mockSignerGetChainId.mockClear();
  contractConstructor.mockClear();

  zKCWeb3JsonRpcSigner = new ZKCWeb3JsonRpcSigner(fakeWeb3Provider);
});

describe('ZKCWeb3JsonRpcSigner class', () => {
  it('test new ZKCWeb3JsonRpcSigner class and getSigner(), getAccount(), getJsonRpcProvider()', async () => {
    expect.assertions(8);
    expect(zKCWeb3JsonRpcSigner.signer).toBe(fakerSigner);

    mockSignerGetAddress.mockResolvedValueOnce(fakerAddress);
    expect(mockSignerGetAddress).toHaveBeenCalledTimes(0);
    expect(await zKCWeb3JsonRpcSigner.getAccount()).toBe(fakerAddress);
    expect(mockSignerGetAddress).toHaveBeenCalledTimes(1);

    expect(zKCWeb3JsonRpcSigner.provider).toBe(fakerSigner.provider);

    expect(mockSignerConnect).toHaveBeenCalledTimes(0);
    zKCWeb3JsonRpcSigner.connect(fakerProvider);
    expect(mockSignerConnect).toHaveBeenCalledTimes(1);
    expect(mockSignerConnect).toHaveBeenCalledWith(fakerProvider);
  });

  it('test getAccountInfo()', async () => {
    mockSignerGetAddress.mockResolvedValueOnce(fakerAddress);
    mockSignerGetChainId.mockResolvedValueOnce(fakerChainIdNum);

    expect.assertions(4);

    const accountInfo = await zKCWeb3JsonRpcSigner.getAccountInfo();

    expect(accountInfo).toEqual({
      address: fakerAddress,
      chainId: fakerChainIdNum.toString(),
      signer: fakerSigner
    });
    expect(accountInfo.signer).toBe(fakerSigner);
    expect(mockSignerGetAddress).toBeCalledTimes(1);
    expect(mockSignerGetChainId).toBeCalledTimes(1);
  });

  it('test getContractWithSigner()', () => {
    zKCWeb3JsonRpcSigner.getContractWithSigner(fakerAddress, fakerAbi);
    expect(Contract).toHaveBeenCalledTimes(1);
    expect(Contract).toHaveBeenCalledWith(
      fakerAddress,
      fakerAbi,
      zKCWeb3JsonRpcSigner.signer
    );
  });
});
