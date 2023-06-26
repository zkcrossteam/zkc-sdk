# ZKC-SDK（Client API）

## web3subscribe

### address

```ts
function encodeL1address(addressHex: string, chex: string): BN;
```

```ts
function decodeL1address(l1address: string): string[];
```

```ts
function toHexStr(a: string): string;
```

```ts
function toDecStr(a: string): string;
```

```ts
function toSS58(bn: string): any;
```

```ts
function SS58toBN(ss58: string): BN;
```

### client

```ts
const delphinusContract = new DelphinusContract(
web3Instance: DelphinusWeb3, jsonInterface: any, address: string, account?: string)
```

```ts
const contract: Contract = getWeb3Contract();
```

```ts
const jsonInterface: any = getJsonInterface();
```

```ts
const pastEventsFrom: Promise<EventData[]> = delphinusContract.getPastEventsFrom(fromBlock: number)
```

```ts
const pastEventsFromTo: Promise<EventData[]> = delphinusContract.getPastEventsFromTo(fromBlock: number, toBlock: number)
```

```ts
const pastEventsFromSteped: Promise<{ events: never[]; breakpoint: null; } | { events: EventData[][]; breakpoint: number; }> = delphinusContract.getPastEventsFromSteped( fromBlock: number, toBlock: number, step: number)
```

```ts
const address: string = delphinusContract.address();
```

#### DelphinusWeb3

```ts
const delphinusWeb3 = new DelphinusWeb3(web3Instance: Web3, close?: (_: provider) => Promise<void>)；
```

```ts
delphinusWeb3.connect(): Promise<void>；
```

```ts
delphinusWeb3.close(): Promise<void>；
```

```ts
DelphinusWeb3.switchNet(chainHexId: string,chainName: string,rpcSource: string,nativeCurrency?: {name: string;symbol: string;decimals: number;},blockExplorer?: string): Promise<void>；
```

```ts
const networkId: Promise<number> = delphinusWeb3.getNetworkId()；
```

```ts
const networkId: string = delphinusWeb3.getDefaultAccount()；
```

```ts
delphinusWeb3.setDefaultAccount(account: string): void；
```

```ts
const accountInfo: Promise<{ address: string;chainId: string;web3: Web3;}> = delphinusWeb3.getAccountInfo()；
```

```ts
const accountInfo: DelphinusContract = delphinusWeb3.getContract(jsonInterface: any, address: string, account?: string)；
```

#### Web3BrowsersMode

```ts
cosnt web3BrowsersMode = new Web3BrowsersMode();
```

```ts
web3BrowsersMode.connect(): Promise<void>;
```

```ts
web3BrowsersMode.close(): void;
```

```ts
web3BrowsersMode.subscribeAccountChange<T>(cb: (account: string) => T): Promise<void>;
```

```ts
web3BrowsersMode.switchNet( chainHexId: string, chainName: string, rpcSource: string, nativeCurrency?: { name: string; symbol: string; decimals: number; }, blockExplorer?: string): Promise<void>;
```

#### Web3ProviderMode

```ts
const web3ProviderMode = new Web3ProviderMode(config: MonitorMode)；
```

```ts
web3ProviderMode.connect(): void;
```

```ts
web3ProviderMode.close(): Promise<void>;
```

```ts
web3ProviderMode.switchNet(chainHexId: string, chainName: string, rpcSource: string): Promise<void>;
```

#### function

```ts
function withDelphinusWeb3<t>(
  web3: DelphinusWeb3,
  cb: (web3: DelphinusWeb3) => Promise<t>
): Promise<t>;
```

```ts
function withBrowerWeb3<t>(cb: (web3: DelphinusWeb3) => Promise<t>): Promise<t>;
```

```ts
function withProviderWeb3<t>(
  config: MonitorMode,
  cb: (web3: DelphinusWeb3) => Promise<t>
): Promise<t>;
```

### DBHelper

```ts
const dBHelper = new DBHelper(url: string, n: string)；
```

```ts
dBHelper.connect(): Promise<void>；
```

```ts
dBHelper.close(): Promise<void>
```

```ts
function withDBHelper<T extends DBHelper, R>(
  Ctor: AConstructorTypeOf<T>,
  uri: string,
  n: string,
  cb: (db: T) => Promise<R>
): Promise<R>;
```

### PromiseBinder

```ts
const promiseBinder = new PromiseBinder();
```

```ts
promiseBinder.bind(name: string, promise: any): Promise<any>
```

```ts
promiseBinder.snapshot(name: string): void;
```

```ts
promiseBinder.return(p: () => any): void
```

### provider

#### DelphinusProvider

```ts
const delphinusProvider = new DelphinusProvider(prov: provider);
```

```ts
delphinusProvider.close(): Promise<void>;
```

#### DelphinusHttpProvider

```ts
const delphinusHttpProvider = DelphinusHttpProvider(uri: string);
```

```ts
DelphinusHttpProvider.getDefaultOptions(): {
  keepAlive: boolean;
  timeout: number;
  withCredentials: boolean;
}
```

```ts
delphinusHttpProvider.close(): Promise<void>;
```

#### DelphinusHDWalletProvider

```ts
const delphinusHDWalletProvider = new DelphinusHDWalletProvider(privateKey: string, url: string);
```

```ts
delphinusHDWalletProvider.close(): Promise<void>
```

#### DelphinusWsProvider

```ts
const delphinusWsProvider = new DelphinusWsProvider(uri: string);
```

```ts
DelphinusWsProvider.getDefaultOption(): {
    timeout: number;
    clientConfig: {
        maxReceivedFrameSize: number;
        maxReceivedMessageSize: number;
        keepalive: boolean;
        keepaliveInterval: number;
    };
    reconnect: {
        auto: boolean;
        delay: number;
        maxAttempts: number;
        onTimeout: boolean;
    };
};
```

```ts
delphinusWsProvider.close(): Promise<void>;
```

### sync-pending-events

```ts
function getAbiEvents(abiJson: any): any;
```

```ts
function buildEventValue(events: any, r: EventData): any;
```

#### EventDBHelper

```ts
const eventDBHelper = new EventDBHelper();
```

```ts
const infoCollection: Promise<Collection<Document>> =
  eventDBHelper.getInfoCollection();
```

```ts
const lastMonitorBlock: Promise<any> = eventDBHelper.getLastMonitorBlock();
```

```ts
eventDBHelper.updatelastCheckedBlockNumber(blockNumber:number): Promise<void>
```

```ts
eventDBHelper.updateLastMonitorBlock(r: EventData, v: any): Promise<void>
```

#### EventTracker

```ts
const eventTracker = new EventTracker(
  networkId: string,
  dataJson: any,
  source: string,
  monitorAccount: string,
  mongodbUrl: string,
  eventsSyncStep: number,
  eventSyncStartingPoint: number,
  bufferBlocks: number,
) ;
```

```ts
eventTracker.syncEvents(
  handlers: (n: string, v: any, hash: string) => Promise<void>
): Promise<void>
```

```ts
eventTracker.subscribePendingEvents(): Promise<void>
```

```ts
eventTracker.close(): Promise<void>
```

```ts
function withEventTracker(
  networkId: string,
  dataJson: any,
  source: string,
  monitorAccount: string,
  mongodbUrl: string,
  eventsSyncStep: number,
  eventSyncStartingPoint: number,
  bufferBlocks: number,
  cb: (eventTracker: EventTracker) => Promise<void>
): Promise<void>;
```

```ts
const getweb3: {
  getWeb3FromSource: (provider: string) => any;
};
```

```ts
function getReliableBlockNumber(
  trueLatestBlockNumber: any,
  lastCheckedBlockNumber: number,
  bufferBlocks: number
): Promise<number>;
```

```ts
function getLatestBlockNumberFromSource(provider: string): Promise<any>;
```

```ts
function getTrueLatestBlockNumber(
  provider: string,
  startPoint: number,
  endPoint: number
): Promise<number | null>;
```

```ts
function binarySearchValidBlock(
  provider: string,
  start: number,
  end: number
): Promise<number[]>;
```

## ZkWasmServiceEndpoint

```ts
const zkWasmServiceEndpoint = new ZkWasmServiceEndpoint(endpoint: string, username: string, useraddress: string);
```

```ts
const response: Promise<any> = zkWasmServiceEndpoint.prepareRequest( method: "GET" | "POST", url: string, body: JSON | FormData | null, headers?: { [key: string]: string; } );
```

```ts
const response: Promise<any> = zkWasmServiceEndpoint.getJSONResponse(json: any);
```

```ts
const response: Promise<any> = zkWasmServiceEndpoint.invokeRequest( method: "GET" | "POST", url: string, body: JSON | FormData | null, headers?: { [key: string]: string; });
```

## ZkWasmServiceHelper(WASM Image operation and query)

```ts
const zkWasmServiceHelper = new ZkWasmServiceHelper(endpoint: string, username: string, useraddress: string)
```

```ts
const image: Promise<any> = zkWasmServiceHelper.queryImage(md5: string);
```

```ts
const user: Promise<any> = zkWasmServiceHelper.queryUser(user_query: UserQueryParams);
```

```ts
interface UserQueryParams {
  user_address: string;
}
```

```ts
const txHistory: Promise<any> = zkWasmServiceHelper.queryTxHistory(history_query: TxHistoryQueryParams);
```

```ts
interface TxHistoryQueryParams {
  user_address: string;
  start?: number;
  total?: number;
}
```

```ts
const config: Promise<any> = zkWasmServiceHelper.queryConfig();
```

```ts
const statistics: Promise<Statistics> = zkWasmServiceHelper.loadStatistics();
```

```ts
interface Statistics {
  totalImages: number;
  totalProofs: number;
  totalTasks: number;
  totalDeployed: number;
}
```

```ts
const tasks: Promise<any> = zkWasmServiceHelper.loadTasks(query: QueryParams);
```

```ts
interface QueryParams {
  user_address: string;
  md5: string;
  id: string;
  tasktype: string;
  taskstatus: string;
  start?: number;
  total?: number;
}
```

```ts
const logs: Promise<any> = zkWasmServiceHelper.queryLogs(query: WithSignature<LogQuery>);
```

```ts
type WithSignature<T> = T & { signature: string };
```

```ts
interface LogQuery {
  id: string;
  user_address: string;
}
```

```ts
const response: Promise<any> = zkWasmServiceHelper.addPayment(payRequest: PaymentParams);
```

```ts
interface PaymentParams {
  txhash: string;
}
```

```ts
const response: Promise<any> = zkWasmServiceHelper.addNewWasmImage(task: WithSignature<AddImageParams>);
```

```ts
interface AddImageParams {
  name: string;
  image: any; //This is because F/E use dom File but cli have to use Buffer. Our rust service just read it as bytes and get data before the first EOF.
  image_md5: string;
  user_address: string;
  description_url: string;
  avator_url: string;
  circuit_size: number;
}
```

```ts
const response: Promise<any> = zkWasmServiceHelper.addProvingTask(task: WithSignature<ProvingParams>);
```

```ts
interface ProvingParams {
  user_address: string;
  md5: string;
  public_inputs: Array<string>;
  private_inputs: Array<string>;
}
```

```ts
const response: string[] = zkWasmServiceHelper.parseProvingTaskInput(rawInputs: string);
```

```ts
const response: Promise<any> = zkWasmServiceHelper.addDeployTask(task: WithSignature<DeployParams>);
```

```ts
interface DeployParams {
  user_address: string;
  md5: string;
  chain_id: number;
}
```

```ts
const response: Promise<any> = zkWasmServiceHelper.addResetTask(task: WithSignature<ResetImageParams>)
```

```ts
interface ResetImageParams {
  md5: string;
  circuit_size: number;
  user_address: string;
}
```

## Task submit and ZK proving

## Contract Proxy and Verification

## util

```ts
const arrayBNs: Array<BN> = ZkWasmUtil.hexToBNs(hexString: string);
```

```ts
const arrayBNs: Array<BN> | null = ZkWasmUtil.parseArg(input: string)；
```

```ts
const md5: string = ZkWasmUtil.convertToMd5(value: Uint8Array)；
```

```ts
const message: string = ZkWasmUtil.createAddImageSignMessage(params: AddImageParams)；
```

```ts
const message: string = ZkWasmUtil.createProvingSignMessage(params: ProvingParams)；
```

```ts
const message: string = ZkWasmUtil.createDeploySignMessage(params: DeployParams)；
```

```ts
interface DeployParams {
  user_address: string;
  md5: string;
  chain_id: number;
}
```

```ts
const message: string = ZkWasmUtil.createResetImageMessage(params: ResetImageParams)；
```

```ts
const message: string = ZkWasmUtil.createModifyImageMessage(params: ModifyImageParams)；
```

```ts
interface ModifyImageParams {
  md5: string;
  user_address: string;
  description_url: string;
  avator_url: string;
}
```
