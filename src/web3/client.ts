import { BlockTag, Provider } from '@ethersproject/abstract-provider';
import { Contract, ContractInterface, Signer } from 'ethers';

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
    return this.contract.address;
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
    return this.contract.queryFilter('*', fromBlock);
  }

  /**
   * Get all events for the contract from the start block height to the end block height.
   * @param fromBlock the start block height
   * @param toBlock the end block height
   * @returns all events for the contract from the start block height to the end block height
   */
  getPastEventsFromTo(fromBlock: BlockTag, toBlock: BlockTag) {
    return this.contract.queryFilter('*', fromBlock, toBlock);
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
