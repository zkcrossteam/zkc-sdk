import { BlockTag, Provider } from "@ethersproject/abstract-provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Maybe } from "@metamask/providers/dist/utils";
import { Contract, ContractInterface, providers, Signer } from "ethers";
import { HTTPClient } from "koajax";
export type InitWasm = (importObject: WebAssembly.Imports) => Promise<WebAssembly.WebAssemblyInstantiatedSource>;
export type IDType = Record<'id', string>;
export type BaseType = IDType & Record<'createdAt' | 'updatedAt', string>;
export type MD5Type = Record<'md5', string>;
export type UserAddressType = Record<'user_address', string>;
export type PaginationParameters = Record<'pageIndex' | 'pageSize', number>;
export type ZKCInputs = Record<'public_inputs' | 'private_inputs', string[]>;
export type WithSignature<T> = T & {
    signature: string;
};
export type PageData<T extends BaseType> = {
    list: T[];
    count: number;
};
export enum TaskStatusEnum {
    PENDING = "Pending",
    PROCESSING = "Processing",
    DONE = "Done",
    FAIL = "Fail",
    STALE = "Stale"
}
export enum TaskTypeEnum {
    SETUP = "Setup",
    PROVE = "Prove",
    VERIFY = "Verify",
    BATCH = "Batch",
    DEPLOY = "Deploy",
    RESET = "Reset"
}
export type CreateTaskParams = UserAddressType & ZKCInputs & MD5Type;
export type DeployWasmApplicationParams = WithSignature<Record<'address' | 'name' | 'description', string> & {
    data: File[];
    chainList: number[];
}>;
export interface WasmApplicationListQueryParams extends Record<'uuid' | 'address' | 'name' | 'website' | 'keywords', string>, Partial<MD5Type & PaginationParameters> {
    chainList: number[];
    tasktype?: TaskTypeEnum;
    taskstatus?: TaskStatusEnum;
}
export interface TaskListQueryParams extends Partial<UserAddressType & MD5Type & PaginationParameters> {
    tasktype?: TaskTypeEnum;
    taskstatus?: TaskStatusEnum;
}
export interface Task extends BaseType, UserAddressType, ZKCInputs, MD5Type, Record<'submit_time' | 'process_started' | 'process_finished', string>, Record<'status_message' | 'internal_message', string | null>, Record<'proof' | 'instances' | 'aux', number[]> {
    _id: {
        $oid: string;
    };
    status: TaskStatusEnum;
    task_type: TaskTypeEnum;
    chain_id: number | null;
    task_fee: number[];
    application: WasmApplication;
}
export interface WasmApplication extends BaseType, MD5Type, Record<'rewardsAccumulated' | 'size' | 'totalRequest' | 'totalWallet', number>, Record<'address' | 'description' | 'fileName' | 'icon' | 'name' | 'uuid' | 'zkcBalance', string> {
    chainList: number[];
    type: TaskTypeEnum;
}
export interface ProofDetail extends CreateTaskParams {
    application: WasmApplication;
    status: TaskStatusEnum;
}
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
    /**
     * @param address Contract address
     * @param abi Contract ABI
     * @param signerOrProvider Signer or provider
     */
    constructor(address: string, abi: ContractInterface, signerOrProvider?: Signer | Provider);
    /**
     * Get the abi of this contract.
     */
    get ABI(): ContractInterface;
    /**
     * Get the address of the contract.
     */
    get address(): string;
    /**
     * Get the contract object
     */
    get contract(): Contract;
    /**
     * Get all events for the contract starting from the height of the starting block.
     * @param fromBlock Height of the starting block
     * @returns all events for the contract starting from the height of the starting block
     */
    getPastEventsFrom(fromBlock: BlockTag): Promise<import("ethers").Event[]>;
    /**
     * Get all events for the contract from the start block height to the end block height.
     * @param fromBlock the start block height
     * @param toBlock the end block height
     * @returns all events for the contract from the start block height to the end block height
     */
    getPastEventsFromTo(fromBlock: BlockTag, toBlock: BlockTag): Promise<import("ethers").Event[]>;
    /**
     * Get all the events of the contract from the start block height to the end block height,
     * and grouped according to the fixed block height.
     * @param fromBlock the start block height
     * @param toBlock the end block height
     * @param step fixed block height
     * @returns events of the contract that have been grouped
     */
    getPastEventsFromSteped(fromBlock: number, toBlock: number, step: number): Promise<{
        events: never[];
        breakpoint: null;
    } | {
        events: import("ethers").Event[][];
        breakpoint: number;
    }>;
}
export class ZKCWeb3JsonRpcSigner {
    constructor(provider: providers.Web3Provider);
    /**
     * Get signer object.
     */
    get signer(): providers.JsonRpcSigner;
    /**
     * Get the provider of the Signer object.
     */
    get provider(): providers.JsonRpcProvider;
    /**
     * Get the account address of the Signer object.
     * @returns the account address of the Signer object
     */
    getAccount(): Promise<string>;
    connect(provider: Provider): providers.JsonRpcSigner;
    /**
     * Get the account information of the signer object.
     * @returns accoun's info
     */
    getAccountInfo(): Promise<AccountInfo>;
    /**
     * Get the contract object associated with the current Signer.
     * @param address contract address
     * @param abi contract address
     * @returns the contract object associated with the current Signer.
     */
    getContractWithSigner(address: string, abi: ContractInterface): ZKCWeb3Contract;
}
export abstract class ZKCWeb3Provider {
    /**
     * @param provider providers.ExternalProvider | providers.JsonRpcFetchFunc
     */
    constructor(provider: providers.ExternalProvider | providers.JsonRpcFetchFunc);
    get provider(): providers.Web3Provider;
    /**
     * Get the network id of the provider object.
     * @returns the network id of the provider object
     */
    getNetwork(): Promise<providers.Network>;
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
    getContractWithoutSigner(address: string, abi: ContractInterface): ZKCWeb3Contract;
}
export class ZKCWeb3MetaMaskProvider extends ZKCWeb3Provider {
    constructor();
    get externalProvider(): MetaMaskInpageProvider;
    connect(): Promise<string[]>;
    switchNet<T>(chainInfo?: {
        chainId: number;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls: string[];
    }): Promise<Maybe<T>>;
    checkAccount(user_address?: string): Promise<string>;
    /**
     * Subscribe to event.
     * @param eventName event name
     * @param callback callback function
     */
    subscribeEvent<T>(eventName: providers.EventType, callback: (arg: T) => any): void;
    /**
     * Subscribe to the `reciptsChanged` event.
     * @param callback callback function
     */
    onAccountsChanged(callback: (account: string) => any): void;
    /**
     * Get JsonRpcSigner object.
     * @returns JsonRpcSigner object
     */
    getZKCWeb3JsonRpcSigner(): ZKCWeb3JsonRpcSigner;
    /**
     * Signature
     * @param message signature message
     * @returns Signature certificate
     */
    sign(message: string): Promise<string>;
}
export function withZKCWeb3MetaMaskProvider<T>(cb: (provider: ZKCWeb3Provider) => Promise<T> | T): Promise<T>;
declare abstract class ZKCService {
    baseURI: string;
    client: HTTPClient<import("koajax").Context>;
    constructor(baseURI?: string);
}
export class ZKCProveService extends ZKCService {
    /**
     * create a task to prove the inputs, upload the proof to the chain.
     * @param taskInfo task information
     * @returns task status and application detail
     */
    createOne(taskInfo: WithSignature<CreateTaskParams>): Promise<import("koajax").Response<ProofDetail>>;
    /**
     * Request task list
     * @param query request parameter
     * @returns task list
     */
    getList(query: TaskListQueryParams): Promise<import("koajax").Response<Task[]>>;
    /**
     * Initialize account and network, prove and deploy task
     * @param userAddress userAddress already been connected
     */
    settlement(provider: ZKCWeb3Provider, taskInfo: Omit<CreateTaskParams, 'user_address'>, userAddress?: string, chainInfo?: ChainInfo): Promise<import("koajax").Response<ProofDetail>>;
}
/**
 * Merkle tree
 * 0
 * 1 2
 * 3 4 5 6
 * 7 8 9 10 11 12 13 14
 *   ...
 * 2^32-1 2^32 ... 2^33-2
 */
export const MERKLE_TREE_HEIGHT = 32n;
export enum Mode {
    FETCH = 0,
    STORE = 1
}
export const CACHE: {
    0: string;
    1: string;
};
export interface LeafData {
    node: {
        data: string;
    };
    hash: string;
}
export const generateBigIntArray: (length: number) => bigint[];
export class ZKState {
    baseURI: string;
    constructor(baseURI?: string);
    client: HTTPClient<import("koajax").Context>;
    /**
     * Convert bigint array to base64 string in little endian order
     */
    binaryArrayToBase64(bigintArray: bigint[]): string;
    /**
     * Convert base64 string to bigint array in little endian order
     */
    base64ToBinaryArray(base64String: string): bigint[];
    /**
     * rpc synchronous request
     * @param method request methd
     * @param path path
     * @param body request body
     * @returns respoonse text
     */
    requestRPC(method: string, path: string, body?: XMLHttpRequestBodyInit | Document | null): any;
    /**
     * Get merkle tree node address
     * @param value merkle tree node index
     */
    merkle_address: (value: string | number | bigint | boolean) => bigint;
    /**
     * Get merkle root address hash
     * @returns [u64; 4]
     */
    merkle_getroot: () => bigint | undefined;
    /**
     * Set merkle root address
     */
    merkle_setroot: (value: bigint) => any;
    /**
     * Get merkle leaf data with hash
     */
    merkle_get: () => bigint | undefined;
    /**
     * Set data in merkle tree node
     */
    merkle_set: (value: bigint) => void;
    cache_set_mode: (mode: bigint) => number;
    /**
     * Create a mapping of data to hash, store or retrieve the corresponding data mapping
     */
    cache_set_hash: (value: bigint) => void;
    cache_fetch_data: () => bigint | undefined;
    cache_store_data: (value: bigint) => void;
    poseidon_new: () => never[];
    poseidon_push: (value: bigint) => number;
    poseidon_finalize: () => bigint | undefined;
}
export function setMemory(memory: WebAssembly.Memory): void;
export function getStateEnv(baseURI?: string): {
    merkle_address: (value: string | number | bigint | boolean) => bigint;
    merkle_setroot: (value: bigint) => any;
    merkle_getroot: () => bigint | undefined;
    merkle_set: (value: bigint) => void;
    merkle_get: () => bigint | undefined;
    poseidon_new: () => never[];
    poseidon_push: (value: bigint) => number;
    poseidon_finalize: () => bigint | undefined;
    cache_set_mode: (mode: bigint) => number;
    cache_store_data: (value: bigint) => void;
    cache_set_hash: (value: bigint) => void;
    cache_fetch_data: () => bigint | undefined;
};
export const LOG_ENV: {
    wasm_console_log: (ptr: number, len: number) => void;
    /**
     * - Convert the number to a character
     * - Check if the character is a newline
     * - Print the accumulated result when encountering a newline
     * - Append the character to the print buffer
     */
    wasm_dbg_char: (data: bigint) => number | void;
    wasm_dbg: (a: number) => void;
};
export const Memory: {
    new (descriptor: WebAssembly.MemoryDescriptor): WebAssembly.Memory;
    prototype: WebAssembly.Memory;
}, Table: {
    new (descriptor: WebAssembly.TableDescriptor, value?: any): WebAssembly.Table;
    prototype: WebAssembly.Table;
};
export interface InstanceExport<T extends WebAssembly.Exports> {
    exports: T;
}
export const BASE_ENV: {
    memory: WebAssembly.Memory;
    table: WebAssembly.Table;
    abort: () => never;
    require: (b: boolean) => void;
    wasm_input: () => never;
};
export const SERVICE_PROVIDER: {
    STATE: string;
    PROVE: string;
};
export const DEFAULT_IMPORT: {
    global: {};
    env: {
        wasm_console_log: (ptr: number, len: number) => void;
        wasm_dbg_char: (data: bigint) => number | void;
        wasm_dbg: (a: number) => void;
        memory: WebAssembly.Memory;
        table: WebAssembly.Table;
        abort: () => never;
        require: (b: boolean) => void;
        wasm_input: () => never;
    };
};
declare function instantiateStreamingWasm<T extends WebAssembly.Exports>(wasmFile: URL, importObject?: {
    global: {};
    env: {
        wasm_console_log: (ptr: number, len: number) => void;
        wasm_dbg_char: (data: bigint) => number | void;
        wasm_dbg: (a: number) => void;
        memory: WebAssembly.Memory;
        table: WebAssembly.Table;
        abort: () => never;
        require: (b: boolean) => void;
        wasm_input: () => never;
    };
}, service?: {
    STATE: string;
    PROVE: string;
}): Promise<InstanceExport<T>>;
export class ZKCWasmService extends ZKCService {
    static loadWasm: typeof instantiateStreamingWasm & import("lodash").MemoizedFunction;
    /**
     * Deploy wasm application
     * @param applicationData upload information
     * @returns application detail
     */
    deployWasm(applicationData: DeployWasmApplicationParams): Promise<import("koajax").Response<ProofDetail>>;
    getWasmApplications(query: WasmApplicationListQueryParams): Promise<import("koajax").Response<Task[]>>;
}

//# sourceMappingURL=index.d.ts.map
