import { Maybe } from '@metamask/providers/dist/utils';
import { BlockTag, Provider } from '@ethersproject/abstract-provider';
import { hexlify, hexStripZeros } from 'ethers/lib/utils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, ContractInterface, providers, Signer, utils } from 'ethers';

import { CHAIN_INFO } from './chain';

export interface ChainInfo {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export interface AccountInfo {
  /**
   * the account address
   */
  address: string;
  /**
   * the network id
   */
  chainId: string;
  /**
   * the signer object
   */
  signer: providers.JsonRpcSigner;
}

export class ZKCWeb3Contract {
  private readonly _ABI: ContractInterface;
  private readonly _contract: Contract;

  /**
   * @param address Contract address
   * @param abi Contract ABI
   * @param signerOrProvider Signer or provider
   */
  constructor(
    address: string,
    abi: ContractInterface,
    signerOrProvider?: Signer | Provider
  ) {
    this._ABI = abi;
    this._contract = new Contract(address, abi, signerOrProvider);
  }

  /**
   * Get the abi of this contract.
   */
  get ABI() {
    return this._ABI;
  }

  /**
   * Get the address of the contract.
   */
  get address() {
    return this._contract.address;
  }

  /**
   * Get the contract object
   */
  get contract() {
    return this._contract;
  }

  /**
   * Get all events for the contract starting from the height of the starting block.
   * @param fromBlock Height of the starting block
   * @returns all events for the contract starting from the height of the starting block
   */
  getPastEventsFrom(fromBlock: BlockTag) {
    return this._contract.queryFilter('*', fromBlock);
  }

  /**
   * Get all events for the contract from the start block height to the end block height.
   * @param fromBlock the start block height
   * @param toBlock the end block height
   * @returns all events for the contract from the start block height to the end block height
   */
  getPastEventsFromTo(fromBlock: BlockTag, toBlock: BlockTag) {
    return this._contract.queryFilter('*', fromBlock, toBlock);
  }

  /**
   * Get all the events of the contract from the start block height to the end block height,
   * and grouped according to the fixed block height.
   * @param fromBlock the start block height
   * @param toBlock the end block height
   * @param step fixed block height
   * @returns events of the contract that have been grouped
   */
  async getPastEventsFromSteped(
    fromBlock: number,
    toBlock: number,
    step: number
  ) {
    const pastEvents = [];
    let end = 0;

    if (fromBlock > toBlock) {
      console.log(`No New Blocks Found From: ${fromBlock}`);
      return { events: [], breakpoint: null };
    }

    if (step <= 0) {
      pastEvents.push(await this.getPastEventsFromTo(fromBlock, toBlock));
      end = toBlock;
      console.log(`getEvents from ${fromBlock} to ${toBlock}`);
    } else {
      let start = fromBlock,
        count = 0;

      while (end < toBlock && count < 10) {
        end = Math.min(start + step - 1, toBlock);

        console.log(`getEvents from ${start} to ${end}`);
        const group = await this.getPastEventsFromTo(start, end);

        if (group.length > 0) pastEvents.push(group);
        start += step;
        count++;
      }
    }

    return { events: pastEvents, breakpoint: end };
  }
}

export class ZKCWeb3JsonRpcSigner {
  private _signer: providers.JsonRpcSigner;

  constructor(provider: providers.Web3Provider) {
    this._signer = provider.getSigner();
  }

  /**
   * Get signer object.
   */
  get signer() {
    return this._signer;
  }

  /**
   * Get the provider of the Signer object.
   */
  get provider() {
    return this._signer.provider;
  }

  /**
   * Get the account address of the Signer object.
   * @returns the account address of the Signer object
   */
  getAccount() {
    return this._signer.getAddress();
  }

  connect(provider: Provider) {
    return this._signer.connect(provider);
  }

  /**
   * Get the account information of the signer object.
   * @returns accoun's info
   */
  async getAccountInfo(): Promise<AccountInfo> {
    const address = await this.getAccount();
    const chainId = (await this._signer.getChainId()) + '';

    return { address, chainId, signer: this._signer };
  }

  /**
   * Get the contract object associated with the current Signer.
   * @param address contract address
   * @param abi contract address
   * @returns the contract object associated with the current Signer.
   */
  getContractWithSigner(address: string, abi: ContractInterface) {
    return new ZKCWeb3Contract(address, abi, this._signer);
  }
}

export abstract class ZKCWeb3Provider {
  private _provider: providers.Web3Provider;

  /**
   * @param provider providers.ExternalProvider | providers.JsonRpcFetchFunc
   */
  constructor(
    provider: providers.ExternalProvider | providers.JsonRpcFetchFunc
  ) {
    this._provider = new providers.Web3Provider(provider);
  }

  get provider() {
    return this._provider;
  }

  /**
   * Get the network id of the provider object.
   * @returns the network id of the provider object
   */
  getNetwork() {
    return this._provider.getNetwork();
  }

  /**
   * Connect the wallet.
   */
  abstract connect(): Promise<string[]>;

  /**
   * Select Network.
   * @param chainInfo Network information
   */
  abstract switchNet<T>(chainInfo?: ChainInfo): Promise<Maybe<T>>;

  abstract sign(message: string): Promise<string>;

  abstract checkAccount(user_address?: string): Promise<string>;

  /**
   * Get the contract object with signer.
   * @param address the address of the contract
   * @param abi the abi of the contract
   * @returns the contract object with signer
   */
  getContractWithoutSigner(address: string, abi: ContractInterface) {
    return new ZKCWeb3Contract(address, abi, this._provider);
  }
}

export class ZKCWeb3MetaMaskProvider extends ZKCWeb3Provider {
  private _externalProvider: MetaMaskInpageProvider;

  constructor() {
    if (!window.ethereum)
      throw 'MetaMask not installed, Browser mode is not available.';

    super(window.ethereum as unknown as providers.JsonRpcFetchFunc);
    this._externalProvider = window.ethereum;
  }

  get externalProvider() {
    return this._externalProvider;
  }

  connect() {
    return this._externalProvider.request({
      method: 'eth_requestAccounts'
    }) as Promise<string[]>;
  }

  private switchChain<T>(newChainIdHexString: string) {
    return this._externalProvider.request<T>({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: newChainIdHexString }]
    });
  }

  private addChain<T>(chainInfo: ChainInfo) {
    return this._externalProvider.request<T>({
      method: 'wallet_addEthereumChain',
      params: [chainInfo]
    });
  }

  async switchNet<T>(chainInfo = CHAIN_INFO[0]) {
    const newChainId = chainInfo.chainId;
    const newChainIdHexString = hexStripZeros(hexlify(newChainId));
    const oldChainId = (await this.getNetwork()).chainId;

    console.log(`switch chain from ${oldChainId} to ${newChainId}`);

    if (oldChainId === newChainId) return;

    try {
      return await this.switchChain<T>(newChainIdHexString);
    } catch (error: any) {
      if (error.code === 4902) return this.addChain<T>(chainInfo);

      throw error;
    }
  }

  async checkAccount(user_address?: string) {
    const [account] = await this.connect();

    if (!account) throw new ReferenceError('Account connect error!');

    if (user_address && account.toLowerCase() !== user_address.toLowerCase())
      throw new ReferenceError('Account insistent!');

    return account;
  }

  /**
   * Subscribe to event.
   * @param eventName event name
   * @param callback callback function
   */
  subscribeEvent<T>(eventName: providers.EventType, callback: (arg: T) => any) {
    this.provider.on(eventName, callback);
  }

  /**
   * Subscribe to the `reciptsChanged` event.
   * @param callback callback function
   */
  onAccountsChanged(callback: (account: string) => any) {
    this.subscribeEvent<string[]>('accountsChanged', ([account]) =>
      callback.call(this, account)
    );
  }

  /**
   * Get JsonRpcSigner object.
   * @returns JsonRpcSigner object
   */
  getZKCWeb3JsonRpcSigner() {
    return new ZKCWeb3JsonRpcSigner(this.provider);
  }

  /**
   * Signature
   * @param message signature message
   * @returns Signature certificate
   */
  async sign(message: string) {
    const messageHexString = utils.hexlify(utils.toUtf8Bytes(message));

    const account = await this.getZKCWeb3JsonRpcSigner().getAccount();

    return this._externalProvider.request<string>({
      method: 'personal_sign',
      params: [messageHexString, account]
    }) as Promise<string>;
  }
}

async function withZKCWeb3Provider<T>(
  zkcWeb3Provider: ZKCWeb3Provider,
  cb: (web3: ZKCWeb3Provider) => Promise<T> | T
) {
  await zkcWeb3Provider.connect();
  return cb(zkcWeb3Provider);
}

export function withZKCWeb3MetaMaskProvider<T>(
  cb: (provider: ZKCWeb3Provider) => Promise<T> | T
) {
  return withZKCWeb3Provider(new ZKCWeb3MetaMaskProvider(), cb);
}
