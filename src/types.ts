export type InitWasm = (
  importObject: WebAssembly.Imports
) => Promise<WebAssembly.WebAssemblyInstantiatedSource>;

export type IDType = Record<'id', string>;

export type BaseType = IDType & Record<'createdAt' | 'updatedAt', string>;

export type MD5Type = Record<'md5', string>;

export type UserAddressType = Record<'user_address', string>;

export type PaginationParameters = Record<'pageIndex' | 'pageSize', number>;

export type ZKCInputs = Record<'public_inputs' | 'private_inputs', string[]>;

export type WithSignature<T> = T & { signature: string };

export type PageData<T extends BaseType> = {
  list: T[];
  count: number;
};

export enum TaskStatusEnum {
  PENDING = `Pending`,
  PROCESSING = `Processing`,
  DONE = `Done`,
  FAIL = `Fail`,
  STALE = `Stale`
}

export enum TaskTypeEnum {
  SETUP = `Setup`,
  PROVE = `Prove`,
  VERIFY = `Verify`,
  BATCH = `Batch`,
  DEPLOY = `Deploy`,
  RESET = `Reset`
}

export type CreateTaskParams = UserAddressType & ZKCInputs & MD5Type;
export type DeployWasmApplicationParams = WithSignature<
  Record<'address' | 'name' | 'description', string> & {
    data: File[];
    chainList: number[];
  }
>;

export interface WasmApplicationListQueryParams
  extends Record<'uuid' | 'address' | 'name' | 'website' | 'keywords', string>,
    Partial<MD5Type & PaginationParameters> {
  chainList: number[];
  tasktype?: TaskTypeEnum;
  taskstatus?: TaskStatusEnum;
}

export interface TaskListQueryParams
  extends Partial<UserAddressType & MD5Type & PaginationParameters> {
  tasktype?: TaskTypeEnum;
  taskstatus?: TaskStatusEnum;
}

export interface Task
  extends BaseType,
    UserAddressType,
    ZKCInputs,
    MD5Type,
    Record<'submit_time' | 'process_started' | 'process_finished', string>,
    Record<'status_message' | 'internal_message', string | null>,
    Record<'proof' | 'instances' | 'aux', number[]> {
  _id: {
    $oid: string;
  };
  status: TaskStatusEnum;
  task_type: TaskTypeEnum;
  chain_id: number | null;
  task_fee: number[];
  application: WasmApplication;
}

export interface WasmApplication
  extends BaseType,
    MD5Type,
    Record<
      'rewardsAccumulated' | 'size' | 'totalRequest' | 'totalWallet',
      number
    >,
    Record<
      | 'address'
      | 'description'
      | 'fileName'
      | 'icon'
      | 'name'
      | 'uuid'
      | 'zkcBalance',
      string
    > {
  chainList: number[];
  type: TaskTypeEnum;
}

export interface ProofDetail extends CreateTaskParams {
  application: WasmApplication;
  status: TaskStatusEnum;
}
