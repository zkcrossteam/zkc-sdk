export type IDType = Record<'id', string>;

export type MD5Type = Record<'md5', string>;

export type UserAddressType = Record<'user_address', string>;

export type PublicPrivateInputs = Record<
  'public_inputs' | 'private_inputs',
  string[]
>;

export type WithSignature<T> = T & { signature: string };

export type HelperRequestType<T> = {
  data: T;
  total: number;
};

export enum QueryParamsTaskStatusEnum {
  PENDING = `Pending`,
  PROCESSING = `Processing`,
  DONE = `Done`,
  FAIL = `Fail`,
  STALE = `Stale`
}

export enum QueryParamsTaskTypeEnum {
  SETUP = `Setup`,
  PROVE = `Prove`,
  VERIFY = `Verify`,
  BATCH = `Batch`,
  DEPLOY = `Deploy`,
  RESET = `Reset`
}

export type ProvingParams = UserAddressType & MD5Type & PublicPrivateInputs;

export interface LoadTasksQueryParams
  extends UserAddressType,
    MD5Type,
    Partial<Record<'stsrt' | 'total', number>> {
  id: string;
  tasktype: QueryParamsTaskTypeEnum;
  taskstatus: QueryParamsTaskStatusEnum;
}

export interface LoadTasksResultData
  extends UserAddressType,
    PublicPrivateInputs,
    MD5Type,
    Record<
      | 'submit_time'
      | 'process_started'
      | 'process_finished'
      | 'status_message'
      | 'internal_message',
      string
    >,
    Record<'proof' | 'instances' | 'aux', number[]> {
  _id: {
    $oid: string;
  };
  status: QueryParamsTaskStatusEnum;
  task_type: QueryParamsTaskTypeEnum;
  chain_id: number | null;
  task_fee: number[];
}

export type AddProvingTaskParams = UserAddressType &
  PublicPrivateInputs &
  MD5Type;

export type AddProvingTaskResultData = MD5Type & IDType;
