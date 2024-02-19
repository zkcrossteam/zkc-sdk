var $8zHUo$webutility = require("web-utility");
var $8zHUo$koajax = require("koajax");
var $8zHUo$lodashmemoize = require("lodash.memoize");
var $8zHUo$ethers = require("ethers");
var $8zHUo$etherslibutils = require("ethers/lib/utils");


function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $bef25fe248bef299$exports = {};

$parcel$export($bef25fe248bef299$exports, "ZKCProveService", () => $bef25fe248bef299$export$b6f724a239470797);


const $56a7e8569c4c72cb$export$60b3abdd0b35d54 = "https://rpc.zkcross.org";
const $56a7e8569c4c72cb$export$3730c1cd29ce7838 = "http://localhost:50000/v1";


class $da1fff4aede411b9$export$78ab13f417f3236e {
    constructor(baseURI = (0, $56a7e8569c4c72cb$export$60b3abdd0b35d54)){
        this.baseURI = baseURI;
        this.client = new (0, $8zHUo$koajax.HTTPClient)({
            responseType: "json"
        });
        this.client.baseURI = baseURI;
    }
}
function $da1fff4aede411b9$export$baab7df1c8e4df25(target, key, meta) {
    const origin = meta.value;
    meta.value = async function(...data) {
        console.debug(`${key} begin Input:`, data);
        console.debug(`${key} Context:`, this);
        try {
            const result = await origin.apply(this, data);
            console.debug(`${key} end Output:`, JSON.stringify(result));
            return result;
        } catch (error) {
            console.debug(`${key} Error:`, error);
            throw error;
        }
    };
}


class $bef25fe248bef299$export$b6f724a239470797 extends (0, $da1fff4aede411b9$export$78ab13f417f3236e) {
    /**
   * create a task to prove the inputs, upload the proof to the chain.
   * @param taskInfo task information
   * @returns task status and application detail
   */ createOne(taskInfo) {
        return this.client.post("task/proof", taskInfo);
    }
    /**
   * Request task list
   * @param query request parameter
   * @returns task list
   */ getList(query) {
        return this.client.get(`task?${(0, $8zHUo$webutility.buildURLData)(query)}`);
    }
    /**
   * Initialize account and network, prove and deploy task
   * @param userAddress userAddress already been connected
   */ async settlement(provider, taskInfo, userAddress, chainInfo) {
        const account = await provider.checkAccount(userAddress);
        const user_address = account.toLowerCase();
        await provider.switchNet(chainInfo);
        /**
     * @todo The JSON stringify method behaves differently in different environments, we need to work with the backend to ensure the order of passing the parameters.
     */ const { md5: md5, public_inputs: public_inputs, private_inputs: private_inputs } = taskInfo, data = {
            user_address: user_address,
            md5: md5,
            public_inputs: public_inputs,
            private_inputs: private_inputs
        };
        const message = JSON.stringify(data);
        const signature = await provider.sign(message);
        return this.createOne({
            ...data,
            signature: signature
        });
    }
}


var $6c8ef806f48fc1c7$exports = {};

$parcel$export($6c8ef806f48fc1c7$exports, "setMemory", () => $6c8ef806f48fc1c7$export$b5d4458425c99b41);
$parcel$export($6c8ef806f48fc1c7$exports, "getStateEnv", () => $6c8ef806f48fc1c7$export$14f294da74a4bee6);
$parcel$export($6c8ef806f48fc1c7$exports, "LOG_ENV", () => $6c8ef806f48fc1c7$export$270181667dced836);

var $aa16da652409fa9f$exports = {};

$parcel$export($aa16da652409fa9f$exports, "MERKLE_TREE_HEIGHT", () => $aa16da652409fa9f$export$338f79b4e5f23b3a);
$parcel$export($aa16da652409fa9f$exports, "Mode", () => $aa16da652409fa9f$export$9484bbecc3c49a2e);
$parcel$export($aa16da652409fa9f$exports, "CACHE", () => $aa16da652409fa9f$export$57f35995a0678bd6);
$parcel$export($aa16da652409fa9f$exports, "generateBigIntArray", () => $aa16da652409fa9f$export$552d48455253a38d);
$parcel$export($aa16da652409fa9f$exports, "ZKState", () => $aa16da652409fa9f$export$b80cfefa1a115fbe);


const $aa16da652409fa9f$export$338f79b4e5f23b3a = 32n;
var $aa16da652409fa9f$export$9484bbecc3c49a2e;
(function(Mode) {
    Mode[Mode["FETCH"] = 0] = "FETCH";
    Mode[Mode["STORE"] = 1] = "STORE";
})($aa16da652409fa9f$export$9484bbecc3c49a2e || ($aa16da652409fa9f$export$9484bbecc3c49a2e = {}));
const $aa16da652409fa9f$export$57f35995a0678bd6 = {
    [0]: "ModeFetch",
    [1]: "ModeStore"
};
const $aa16da652409fa9f$export$552d48455253a38d = (length)=>Array.from({
        length: length
    }, ()=>BigInt(0));
class $aa16da652409fa9f$export$b80cfefa1a115fbe {
    constructor(baseURI = (0, $56a7e8569c4c72cb$export$3730c1cd29ce7838)){
        this.baseURI = baseURI;
        this.client = new (0, $8zHUo$koajax.HTTPClient)({
            responseType: "json"
        });
        this._address = BigInt(0);
        this._root_hash = [];
        this._root_data = [];
        this._cache_mode = 0;
        this._cache_hash = [];
        this._cache_data = [];
        this._leaf_hash = [];
        this._poseidon_buffer = [];
        this._poseidon_results = [];
        this./**
   * rpc synchronous request
   * @param method request methd
   * @param path path
   * @param body request body
   * @returns respoonse text
   */ requestRPC = (method, path, body)=>{
            const xhr = new XMLHttpRequest();
            xhr.open(method, `${this.client.baseURI}/${path}`, false);
            xhr.send(body);
            if (xhr.status === 200) return JSON.parse(xhr.responseText);
            throw new Error(`Request failed with status code: ${xhr.status}`);
        };
        this./**
   * Get merkle tree node address
   * @param value merkle tree node index
   */ merkle_address = (value)=>this._address = BigInt(value) + (1n << $aa16da652409fa9f$export$338f79b4e5f23b3a) - 1n;
        this./**
   * Get merkle root address hash
   * @returns [u64; 4]
   */ merkle_getroot = ()=>{
            // The client already drained up all the data obtained from remote server.
            // We need to issue RPC to server again.
            if (this._root_hash.length) return this._root_hash.shift();
            const data = this.requestRPC("GET", "root");
            if (!data?.root) throw new Error("Get merkle root hash failed!");
            const binaryData = this.base64ToBinaryArray(data.root);
            this._root_hash.push(...binaryData);
            console.log("get root method, root data", binaryData);
            return this._root_hash.shift();
        };
        this./**
   * Set merkle root address
   */ merkle_setroot = (value)=>{
            this._root_data.push(value);
            // merkle_setroot takes 4 u64 values and then set the root hash to this array.
            if (this._root_data.length !== 4) return;
            const hash = this.binaryArrayToBase64(this._root_data);
            this._root_data = [];
            return this.requestRPC("POST", "root", JSON.stringify({
                hash: hash
            }));
        };
        this./**
   * Get merkle leaf data with hash
   */ merkle_get = ()=>{
            if (this._leaf_hash.length) return this._leaf_hash.shift();
            // The client already drained up all the data obtained from remote server.
            // We need to issue RPC to server again.
            const { node: node } = this.requestRPC("GET", `leaves?index=${this._address}`);
            if (!node) throw new Error("There is no node data for this leaf");
            const { hash: hash } = node;
            this._leaf_hash = this.base64ToBinaryArray(hash);
            console.log("In JS, merkle get hash result:", node, this._leaf_hash);
            return this._leaf_hash.shift();
        };
        this./**
   * Set data in merkle tree node
   */ merkle_set = (value)=>{
            this._leaf_hash.push(value);
            // merkle_set takes 4 u64 values and then set the leaf hash to this array.
            if (this._leaf_hash.length !== 4) return;
            const hash = this.binaryArrayToBase64(this._leaf_hash);
            console.log("In JavaScript, set index value to", this._leaf_hash);
            let requestData = JSON.stringify({
                index: this._address + "",
                hash: hash
            });
            if (this._cache_data[0]) {
                const data = this.binaryArrayToBase64(this._cache_data);
                console.log("In JavaScript, cache data", this._cache_data);
                requestData = JSON.stringify({
                    index: this._address + "",
                    hash: hash,
                    data: data
                });
            }
            this.requestRPC("POST", "leaves", requestData);
            this._cache_data = [];
            this._leaf_hash = [];
        };
        this.cache_set_mode = (mode)=>this._cache_mode = Number(mode);
        this./**
   * Create a mapping of data to hash, store or retrieve the corresponding data mapping
   */ cache_set_hash = (value)=>{
            this._cache_hash.push(value);
            if (this._cache_hash.length !== 4) return;
            const isFetching = this._cache_mode === 0;
            console.log(this._cache_data, this._cache_hash, this._cache_mode, "=====set hash");
            const base64Hash = this.binaryArrayToBase64(this._cache_hash);
            const base64Data = !isFetching && this._cache_data ? this.binaryArrayToBase64(this._cache_data) : undefined;
            const datahashrecord = JSON.stringify({
                data: base64Data,
                hash: base64Hash,
                mode: $aa16da652409fa9f$export$57f35995a0678bd6[this._cache_mode]
            });
            const { data: data } = this.requestRPC("POST", "datahashrecord", datahashrecord);
            console.log("In JavaScript, fetch cache", "data:", data, "-cache_hash:", this._cache_hash, "-cache_data:", this._cache_data, "mode", this._cache_mode);
            this._cache_hash = [];
            this._cache_data = isFetching ? this.base64ToBinaryArray(data) : [];
        };
        this.cache_fetch_data = ()=>{
            if (this._cache_mode !== 0) return this._cache_data.shift();
            this._cache_mode = 1;
            const length = BigInt(this._cache_data.length);
            console.log("fetch success!length: ", length, "data:", this._cache_data);
            return length;
        };
        this.cache_store_data = (value)=>{
            this._cache_data.push(value);
        };
        this.poseidon_new = ()=>this._poseidon_buffer = [];
        this.poseidon_push = (value)=>this._poseidon_buffer.push(value);
        this.poseidon_finalize = ()=>{
            if (this._poseidon_results.length) return this._poseidon_results.shift();
            const base64 = this.binaryArrayToBase64(this._poseidon_buffer);
            console.log("In JavaScript, poseidon buffer", this._poseidon_buffer, base64);
            const { hash: hash } = this.requestRPC("POST", "poseidon", JSON.stringify({
                data: base64
            }));
            if (!hash) return;
            // TODO: we may need to evict some data hashes here.
            // Otherwise the space used by this map will keep growing.
            const poseidon_results_hash_array = this.base64ToBinaryArray(hash);
            this._poseidon_results.push(...poseidon_results_hash_array);
            console.log("In JavaScript, poseidon results", this._poseidon_results);
            return this._poseidon_results.shift();
        };
        this.client.baseURI = baseURI;
    }
    /**
   * Convert bigint array to base64 string in little endian order
   */ binaryArrayToBase64(bigintArray) {
        return btoa(// Convert each BigInt to little-endian bytes and push them to the array
        bigintArray.reduce((acc, bigIntValue)=>acc + String.fromCharCode(...new Uint8Array(8).map((unit8, index)=>Number(bigIntValue >> BigInt(index * 8) & BigInt(0xff)))), ""));
    }
    /**
   * Convert base64 string to bigint array in little endian order
   */ base64ToBinaryArray(base64String) {
        const binaryString = atob(base64String);
        return $aa16da652409fa9f$export$552d48455253a38d(binaryString.length / 8).map((bigint, index)=>$aa16da652409fa9f$export$552d48455253a38d(8).reduce((acc, u64Value, currentIndex)=>acc + (BigInt(binaryString.slice(index * 8, (index + 1) * 8).charCodeAt(currentIndex)) << BigInt(currentIndex * 8)), BigInt(0)));
    }
}


let $6c8ef806f48fc1c7$var$wasmMemory;
function $6c8ef806f48fc1c7$export$b5d4458425c99b41(memory) {
    $6c8ef806f48fc1c7$var$wasmMemory = memory;
}
function $6c8ef806f48fc1c7$export$14f294da74a4bee6(baseURI = (0, $56a7e8569c4c72cb$export$3730c1cd29ce7838)) {
    const { merkle_address: merkle_address, merkle_setroot: merkle_setroot, merkle_getroot: merkle_getroot, merkle_set: merkle_set, merkle_get: merkle_get, poseidon_new: poseidon_new, poseidon_push: poseidon_push, poseidon_finalize: poseidon_finalize, cache_set_mode: cache_set_mode, cache_store_data: cache_store_data, cache_set_hash: cache_set_hash, cache_fetch_data: cache_fetch_data } = new (0, $aa16da652409fa9f$export$b80cfefa1a115fbe)(baseURI);
    return {
        merkle_address: merkle_address,
        merkle_setroot: merkle_setroot,
        merkle_getroot: merkle_getroot,
        merkle_set: merkle_set,
        merkle_get: merkle_get,
        poseidon_new: poseidon_new,
        poseidon_push: poseidon_push,
        poseidon_finalize: poseidon_finalize,
        cache_set_mode: cache_set_mode,
        cache_store_data: cache_store_data,
        cache_set_hash: cache_set_hash,
        cache_fetch_data: cache_fetch_data
    };
}
let $6c8ef806f48fc1c7$var$_print_buf = [];
function $6c8ef806f48fc1c7$var$print_result() {
    // Convert the array of numbers to a string
    const result = String.fromCharCode(...$6c8ef806f48fc1c7$var$_print_buf);
    $6c8ef806f48fc1c7$var$_print_buf = [];
    console.log(result);
}
const $6c8ef806f48fc1c7$export$270181667dced836 = {
    wasm_console_log: (ptr, len)=>{
        console.log("Inside wasm", $6c8ef806f48fc1c7$var$wasmMemory, ptr, len);
        const newBuf = $6c8ef806f48fc1c7$var$wasmMemory.buffer.slice(ptr, ptr + len);
        const decoder = new TextDecoder();
        console.log("wasm_console_log: ", decoder.decode(newBuf));
    },
    /**
   * - Convert the number to a character
   * - Check if the character is a newline
   * - Print the accumulated result when encountering a newline
   * - Append the character to the print buffer
   */ wasm_dbg_char: (data)=>String.fromCharCode(Number(data)) === "\n" ? $6c8ef806f48fc1c7$var$print_result() : $6c8ef806f48fc1c7$var$_print_buf.push(Number(data)),
    wasm_dbg: (a)=>{
        console.log("Inside wasm, dbg: ", a);
    }
};
$parcel$exportWildcard($6c8ef806f48fc1c7$exports, $aa16da652409fa9f$exports);


var $7a17f07994905f0b$exports = {};

$parcel$export($7a17f07994905f0b$exports, "Memory", () => $7a17f07994905f0b$export$29d4d7bc03c348a5);
$parcel$export($7a17f07994905f0b$exports, "Table", () => $7a17f07994905f0b$export$54ec01a60f47d33d);
$parcel$export($7a17f07994905f0b$exports, "BASE_ENV", () => $7a17f07994905f0b$export$ffc831af85cf0772);
$parcel$export($7a17f07994905f0b$exports, "SERVICE_PROVIDER", () => $7a17f07994905f0b$export$2dddc60dc5277bec);
$parcel$export($7a17f07994905f0b$exports, "DEFAULT_IMPORT", () => $7a17f07994905f0b$export$771d902b9ec2ecf4);
$parcel$export($7a17f07994905f0b$exports, "ZKCWasmService", () => $7a17f07994905f0b$export$2b4350c51ee4af4b);






const { Memory: $7a17f07994905f0b$export$29d4d7bc03c348a5, Table: $7a17f07994905f0b$export$54ec01a60f47d33d } = WebAssembly;
const $7a17f07994905f0b$export$ffc831af85cf0772 = {
    memory: new $7a17f07994905f0b$export$29d4d7bc03c348a5({
        initial: 10,
        maximum: 100
    }),
    table: new $7a17f07994905f0b$export$54ec01a60f47d33d({
        initial: 0,
        element: "anyfunc"
    }),
    abort: ()=>{
        throw new Error("Unsupported wasm api: abort");
    },
    require: (b)=>{
        console.log("Inside wasm: require call(1 means succ!)", b);
        if (!b) throw new Error("Require failed");
    },
    wasm_input: ()=>{
        console.error("wasm_input should not been called in non-zkwasm mode");
        throw new Error("Unsupported wasm api: wasm_input");
    }
};
const $7a17f07994905f0b$export$2dddc60dc5277bec = {
    STATE: (0, $56a7e8569c4c72cb$export$3730c1cd29ce7838),
    PROVE: (0, $56a7e8569c4c72cb$export$60b3abdd0b35d54)
};
const $7a17f07994905f0b$export$771d902b9ec2ecf4 = {
    global: {},
    env: {
        ...$7a17f07994905f0b$export$ffc831af85cf0772,
        ...(0, $6c8ef806f48fc1c7$export$270181667dced836)
    }
};
async function $7a17f07994905f0b$var$instantiateStreamingWasm(wasmFile, importObject = $7a17f07994905f0b$export$771d902b9ec2ecf4, service = $7a17f07994905f0b$export$2dddc60dc5277bec) {
    if (!(wasmFile instanceof URL)) throw new Error("Wrong wasm file url!");
    const { STATE: STATE } = service;
    const { global: global, env: env, ...rest } = importObject;
    const stateEnv = (0, $6c8ef806f48fc1c7$export$14f294da74a4bee6)(STATE);
    console.log(service, "===================ZKC service init");
    const importVariable = {
        global: global,
        env: {
            ...env,
            ...stateEnv
        },
        ...rest
    };
    const { instance: instance } = await WebAssembly.instantiateStreaming(fetch(wasmFile), importVariable);
    const memory = instance.exports.memory;
    (0, $6c8ef806f48fc1c7$export$b5d4458425c99b41)(memory);
    if (!(instance instanceof WebAssembly.Instance)) throw new Error("Load wasm failed!");
    return instance;
}
class $7a17f07994905f0b$export$2b4350c51ee4af4b extends (0, $da1fff4aede411b9$export$78ab13f417f3236e) {
    static{
        this.loadWasm = (0, ($parcel$interopDefault($8zHUo$lodashmemoize)))($7a17f07994905f0b$var$instantiateStreamingWasm);
    }
    /**
   * Deploy wasm application
   * @param applicationData upload information
   * @returns application detail
   */ deployWasm(applicationData) {
        return this.client.post("application", (0, $8zHUo$koajax.makeFormData)(applicationData));
    }
    getWasmApplications(query) {
        return this.client.get(`application?${(0, $8zHUo$webutility.buildURLData)(query)}`);
    }
}


var $faefaad95e5fcca0$exports = {};

$parcel$export($faefaad95e5fcca0$exports, "TaskStatusEnum", () => $faefaad95e5fcca0$export$6929aaef4955c514);
$parcel$export($faefaad95e5fcca0$exports, "TaskTypeEnum", () => $faefaad95e5fcca0$export$8efa975e75f10f1b);
var $faefaad95e5fcca0$export$6929aaef4955c514;
(function(TaskStatusEnum) {
    TaskStatusEnum["PENDING"] = "Pending";
    TaskStatusEnum["PROCESSING"] = "Processing";
    TaskStatusEnum["DONE"] = "Done";
    TaskStatusEnum["FAIL"] = "Fail";
    TaskStatusEnum["STALE"] = "Stale";
})($faefaad95e5fcca0$export$6929aaef4955c514 || ($faefaad95e5fcca0$export$6929aaef4955c514 = {}));
var $faefaad95e5fcca0$export$8efa975e75f10f1b;
(function(TaskTypeEnum) {
    TaskTypeEnum["SETUP"] = "Setup";
    TaskTypeEnum["PROVE"] = "Prove";
    TaskTypeEnum["VERIFY"] = "Verify";
    TaskTypeEnum["BATCH"] = "Batch";
    TaskTypeEnum["DEPLOY"] = "Deploy";
    TaskTypeEnum["RESET"] = "Reset";
})($faefaad95e5fcca0$export$8efa975e75f10f1b || ($faefaad95e5fcca0$export$8efa975e75f10f1b = {}));


var $b70f6a3faaa76334$exports = {};
var $e725a80f22fb4fc1$exports = {};

$parcel$export($e725a80f22fb4fc1$exports, "ZKCWeb3Contract", () => $e725a80f22fb4fc1$export$527326808c8a74aa);
$parcel$export($e725a80f22fb4fc1$exports, "ZKCWeb3JsonRpcSigner", () => $e725a80f22fb4fc1$export$688a4fefb0260ff0);
$parcel$export($e725a80f22fb4fc1$exports, "ZKCWeb3Provider", () => $e725a80f22fb4fc1$export$69f59f326f6b915f);
$parcel$export($e725a80f22fb4fc1$exports, "ZKCWeb3MetaMaskProvider", () => $e725a80f22fb4fc1$export$1190b541012a743b);
$parcel$export($e725a80f22fb4fc1$exports, "withZKCWeb3MetaMaskProvider", () => $e725a80f22fb4fc1$export$f888d54bfa515b62);


const $92311d3dd91ad407$export$bae19f2f7b455cb3 = [
    {
        chainId: 5,
        chainName: "Goerli",
        nativeCurrency: {
            name: "Goerli",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: [
            "https://rpc.ankr.com/eth_goerli"
        ],
        blockExplorerUrls: [
            "https://goerli.etherscan.io"
        ]
    }
];


class $e725a80f22fb4fc1$export$527326808c8a74aa {
    /**
   * @param address Contract address
   * @param abi Contract ABI
   * @param signerOrProvider Signer or provider
   */ constructor(address, abi, signerOrProvider){
        this._ABI = abi;
        this._contract = new (0, $8zHUo$ethers.Contract)(address, abi, signerOrProvider);
    }
    /**
   * Get the abi of this contract.
   */ get ABI() {
        return this._ABI;
    }
    /**
   * Get the address of the contract.
   */ get address() {
        return this._contract.address;
    }
    /**
   * Get the contract object
   */ get contract() {
        return this._contract;
    }
    /**
   * Get all events for the contract starting from the height of the starting block.
   * @param fromBlock Height of the starting block
   * @returns all events for the contract starting from the height of the starting block
   */ getPastEventsFrom(fromBlock) {
        return this._contract.queryFilter("*", fromBlock);
    }
    /**
   * Get all events for the contract from the start block height to the end block height.
   * @param fromBlock the start block height
   * @param toBlock the end block height
   * @returns all events for the contract from the start block height to the end block height
   */ getPastEventsFromTo(fromBlock, toBlock) {
        return this._contract.queryFilter("*", fromBlock, toBlock);
    }
    /**
   * Get all the events of the contract from the start block height to the end block height,
   * and grouped according to the fixed block height.
   * @param fromBlock the start block height
   * @param toBlock the end block height
   * @param step fixed block height
   * @returns events of the contract that have been grouped
   */ async getPastEventsFromSteped(fromBlock, toBlock, step) {
        const pastEvents = [];
        let end = 0;
        if (fromBlock > toBlock) {
            console.log(`No New Blocks Found From: ${fromBlock}`);
            return {
                events: [],
                breakpoint: null
            };
        }
        if (step <= 0) {
            pastEvents.push(await this.getPastEventsFromTo(fromBlock, toBlock));
            end = toBlock;
            console.log(`getEvents from ${fromBlock} to ${toBlock}`);
        } else {
            let start = fromBlock, count = 0;
            while(end < toBlock && count < 10){
                end = Math.min(start + step - 1, toBlock);
                console.log(`getEvents from ${start} to ${end}`);
                const group = await this.getPastEventsFromTo(start, end);
                if (group.length > 0) pastEvents.push(group);
                start += step;
                count++;
            }
        }
        return {
            events: pastEvents,
            breakpoint: end
        };
    }
}
class $e725a80f22fb4fc1$export$688a4fefb0260ff0 {
    constructor(provider){
        this._signer = provider.getSigner();
    }
    /**
   * Get signer object.
   */ get signer() {
        return this._signer;
    }
    /**
   * Get the provider of the Signer object.
   */ get provider() {
        return this._signer.provider;
    }
    /**
   * Get the account address of the Signer object.
   * @returns the account address of the Signer object
   */ getAccount() {
        return this._signer.getAddress();
    }
    connect(provider) {
        return this._signer.connect(provider);
    }
    /**
   * Get the account information of the signer object.
   * @returns accoun's info
   */ async getAccountInfo() {
        const address = await this.getAccount();
        const chainId = await this._signer.getChainId() + "";
        return {
            address: address,
            chainId: chainId,
            signer: this._signer
        };
    }
    /**
   * Get the contract object associated with the current Signer.
   * @param address contract address
   * @param abi contract address
   * @returns the contract object associated with the current Signer.
   */ getContractWithSigner(address, abi) {
        return new $e725a80f22fb4fc1$export$527326808c8a74aa(address, abi, this._signer);
    }
}
class $e725a80f22fb4fc1$export$69f59f326f6b915f {
    /**
   * @param provider providers.ExternalProvider | providers.JsonRpcFetchFunc
   */ constructor(provider){
        this._provider = new (0, $8zHUo$ethers.providers).Web3Provider(provider);
    }
    get provider() {
        return this._provider;
    }
    /**
   * Get the network id of the provider object.
   * @returns the network id of the provider object
   */ getNetwork() {
        return this._provider.getNetwork();
    }
    /**
   * Get the contract object with signer.
   * @param address the address of the contract
   * @param abi the abi of the contract
   * @returns the contract object with signer
   */ getContractWithoutSigner(address, abi) {
        return new $e725a80f22fb4fc1$export$527326808c8a74aa(address, abi, this._provider);
    }
}
class $e725a80f22fb4fc1$export$1190b541012a743b extends $e725a80f22fb4fc1$export$69f59f326f6b915f {
    constructor(){
        if (!window.ethereum) throw "MetaMask not installed, Browser mode is not available.";
        super(window.ethereum);
        this._externalProvider = window.ethereum;
    }
    get externalProvider() {
        return this._externalProvider;
    }
    connect() {
        return this._externalProvider.request({
            method: "eth_requestAccounts"
        });
    }
    switchChain(newChainIdHexString) {
        return this._externalProvider.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: newChainIdHexString
                }
            ]
        });
    }
    addChain(chainInfo) {
        return this._externalProvider.request({
            method: "wallet_addEthereumChain",
            params: [
                chainInfo
            ]
        });
    }
    async switchNet(chainInfo = (0, $92311d3dd91ad407$export$bae19f2f7b455cb3)[0]) {
        const newChainId = chainInfo.chainId;
        const newChainIdHexString = (0, $8zHUo$etherslibutils.hexStripZeros)((0, $8zHUo$etherslibutils.hexlify)(newChainId));
        const oldChainId = (await this.getNetwork()).chainId;
        console.log(`switch chain from ${oldChainId} to ${newChainId}`);
        if (oldChainId === newChainId) return;
        try {
            return await this.switchChain(newChainIdHexString);
        } catch (error) {
            if (error.code === 4902) return this.addChain(chainInfo);
            throw error;
        }
    }
    async checkAccount(user_address) {
        const [account] = await this.connect();
        if (!account) throw new ReferenceError("Account connect error!");
        if (user_address && account.toLowerCase() !== user_address.toLowerCase()) throw new ReferenceError("Account insistent!");
        return account;
    }
    /**
   * Subscribe to event.
   * @param eventName event name
   * @param callback callback function
   */ subscribeEvent(eventName, callback) {
        this.provider.on(eventName, callback);
    }
    /**
   * Subscribe to the `reciptsChanged` event.
   * @param callback callback function
   */ onAccountsChanged(callback) {
        this.subscribeEvent("accountsChanged", ([account])=>callback.call(this, account));
    }
    /**
   * Get JsonRpcSigner object.
   * @returns JsonRpcSigner object
   */ getZKCWeb3JsonRpcSigner() {
        return new $e725a80f22fb4fc1$export$688a4fefb0260ff0(this.provider);
    }
    /**
   * Signature
   * @param message signature message
   * @returns Signature certificate
   */ async sign(message) {
        const messageHexString = (0, $8zHUo$ethers.utils).hexlify((0, $8zHUo$ethers.utils).toUtf8Bytes(message));
        const account = await this.getZKCWeb3JsonRpcSigner().getAccount();
        return this._externalProvider.request({
            method: "personal_sign",
            params: [
                messageHexString,
                account
            ]
        });
    }
}
async function $e725a80f22fb4fc1$var$withZKCWeb3Provider(zkcWeb3Provider, cb) {
    await zkcWeb3Provider.connect();
    return cb(zkcWeb3Provider);
}
function $e725a80f22fb4fc1$export$f888d54bfa515b62(cb) {
    return $e725a80f22fb4fc1$var$withZKCWeb3Provider(new $e725a80f22fb4fc1$export$1190b541012a743b(), cb);
}


$parcel$exportWildcard($b70f6a3faaa76334$exports, $e725a80f22fb4fc1$exports);


$parcel$exportWildcard(module.exports, $bef25fe248bef299$exports);
$parcel$exportWildcard(module.exports, $7a17f07994905f0b$exports);
$parcel$exportWildcard(module.exports, $faefaad95e5fcca0$exports);
$parcel$exportWildcard(module.exports, $b70f6a3faaa76334$exports);
$parcel$exportWildcard(module.exports, $6c8ef806f48fc1c7$exports);


//# sourceMappingURL=index.js.map
