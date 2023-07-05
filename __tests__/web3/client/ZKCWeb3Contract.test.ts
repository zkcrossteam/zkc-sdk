import { Provider } from '@ethersproject/abstract-provider';
import { constants, Contract, ContractInterface, Signer } from 'ethers';

import { ZKCWeb3Contract } from '../../../src';
import { fakerAddressFn, fakerBlockNumFn } from '../../common/faker';

const fakerAddress = fakerAddressFn();
const fakerAbi = ['function name() view returns (string)'];
const fakerEvent = 'hi';
const fakerBlockNum = fakerBlockNumFn();

const contractConstructor = jest.fn(
  (
    address: string,
    abi: ContractInterface,
    signerOrProvider?: Signer | Provider
  ) => ({ address, abi, signerOrProvider })
);
const contractQueryFilter = jest.fn(async () => [fakerEvent]);

jest.mock('ethers', () => ({
  __esModule: true,
  ...jest.requireActual('ethers'),
  Contract: jest.fn().mockImplementation(() => ({
    constructor: contractConstructor,
    address: fakerAddress,
    queryFilter: contractQueryFilter
  }))
}));

const newZKCWeb3Contract = new ZKCWeb3Contract(
  constants.AddressZero,
  [],
  undefined
);

beforeEach(() => {
  contractConstructor.mockClear();
  contractQueryFilter.mockClear();
});

describe('ZKCWeb3Contract class', () => {
  describe('test new ZKCWeb3Contract class and get ABI(), get address(), get contract()', () => {
    it('should new ZKCWeb3Contract class without signerOrProvider', () => {
      const zKCWeb3Contract = new ZKCWeb3Contract(constants.AddressZero, []);
      expect(zKCWeb3Contract).toBeTruthy();
      expect(Contract).toHaveBeenCalledTimes(1);
      expect(Contract).toHaveBeenCalledWith(
        constants.AddressZero,
        [],
        undefined
      );

      expect(zKCWeb3Contract.address).toBe(fakerAddress);
      expect(zKCWeb3Contract.ABI).toEqual([]);
      expect(zKCWeb3Contract.contract).toBeTruthy();
    });

    it('should new ZKCWeb3Contract class with signerOrProvider', () => {
      const zKCWeb3Contract = new ZKCWeb3Contract(
        fakerAddress,
        fakerAbi,
        {} as Provider
      );
      expect(Contract).toHaveBeenCalledWith(fakerAddress, fakerAbi, {});

      expect(zKCWeb3Contract.ABI).toEqual(fakerAbi);
    });
  });

  describe('test getPastEventsFrom()', () => {
    it('call getPastEventsFrom()', async () => {
      expect.assertions(3);

      const pastEvents = await newZKCWeb3Contract.getPastEventsFrom(
        fakerBlockNum
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith('*', fakerBlockNum);
      expect(pastEvents).toEqual([fakerEvent]);
    });
  });

  describe('test getPastEventsFromTo()', () => {
    it('call getPastEventsFromTo()', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 10;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromTo(
        fakerFromBlock,
        fakerToBlock
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith(
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual([fakerEvent]);
    });
  });

  describe('test getPastEventsFromSteped()', () => {
    it('fromBlock > toBlock, step > 0', async () => {
      expect.assertions(2);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock - 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(0);
      expect(pastEvents).toEqual({ events: [], breakpoint: null });
    });

    it('fromBlock > toBlock, step = 0', async () => {
      expect.assertions(2);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock - 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        0
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(0);
      expect(pastEvents).toEqual({ events: [], breakpoint: null });
    });

    it('fromBlock > toBlock, step < 0', async () => {
      expect.assertions(2);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock - 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        -1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(0);
      expect(pastEvents).toEqual({ events: [], breakpoint: null });
    });

    it('fromBlock = toBlock, step > 0', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith(
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerFromBlock
      });
    });

    it('fromBlock = toBlock, step = 0', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        0
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith(
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerFromBlock
      });
    });

    it('fromBlock = toBlock, step < 0', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        -1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith(
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerFromBlock
      });
    });

    it('fromBlock < toBlock, step > 0', async () => {
      expect.assertions(4);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(2);
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        1,
        '*',
        fakerFromBlock,
        fakerFromBlock
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        2,
        '*',
        fakerFromBlock + 1,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent], [fakerEvent]],
        breakpoint: fakerToBlock
      });
    });

    it('fromBlock < toBlock, step = 0', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        0
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith(
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerToBlock
      });
    });

    it('fromBlock < toBlock, step < 0', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        -1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenCalledWith(
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerToBlock
      });
    });

    it('fromBlock < toBlock, step = 2', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        2
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        1,
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerToBlock
      });
    });

    it('fromBlock < toBlock, step = 3', async () => {
      expect.assertions(3);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 1;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        3
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(1);
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        1,
        '*',
        fakerFromBlock,
        fakerToBlock
      );
      expect(pastEvents).toEqual({
        events: [[fakerEvent]],
        breakpoint: fakerToBlock
      });
    });

    it('fromBlock < toBlock, step = 1, (toBlock - fromBlock) / step = 9', async () => {
      expect.assertions(12);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 9;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(10);
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        1,
        '*',
        fakerFromBlock,
        fakerFromBlock
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        2,
        '*',
        fakerFromBlock + 1,
        fakerFromBlock + 1
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        3,
        '*',
        fakerFromBlock + 2,
        fakerFromBlock + 2
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        4,
        '*',
        fakerFromBlock + 3,
        fakerFromBlock + 3
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        5,
        '*',
        fakerFromBlock + 4,
        fakerFromBlock + 4
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        6,
        '*',
        fakerFromBlock + 5,
        fakerFromBlock + 5
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        7,
        '*',
        fakerFromBlock + 6,
        fakerFromBlock + 6
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        8,
        '*',
        fakerFromBlock + 7,
        fakerFromBlock + 7
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        9,
        '*',
        fakerFromBlock + 8,
        fakerFromBlock + 8
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        10,
        '*',
        fakerToBlock,
        fakerFromBlock + 9
      );
      expect(pastEvents).toEqual({
        events: [
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent]
        ],
        breakpoint: fakerToBlock
      });
    });

    it('fromBlock < toBlock, step = 1, (toBlock - fromBlock) / step > 9', async () => {
      expect.assertions(12);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock + 10;

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        1
      );

      expect(contractQueryFilter).toHaveBeenCalledTimes(10);
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        1,
        '*',
        fakerFromBlock,
        fakerFromBlock
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        2,
        '*',
        fakerFromBlock + 1,
        fakerFromBlock + 1
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        3,
        '*',
        fakerFromBlock + 2,
        fakerFromBlock + 2
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        4,
        '*',
        fakerFromBlock + 3,
        fakerFromBlock + 3
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        5,
        '*',
        fakerFromBlock + 4,
        fakerFromBlock + 4
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        6,
        '*',
        fakerFromBlock + 5,
        fakerFromBlock + 5
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        7,
        '*',
        fakerFromBlock + 6,
        fakerFromBlock + 6
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        8,
        '*',
        fakerFromBlock + 7,
        fakerFromBlock + 7
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        9,
        '*',
        fakerFromBlock + 8,
        fakerFromBlock + 8
      );
      expect(contractQueryFilter).toHaveBeenNthCalledWith(
        10,
        '*',
        fakerFromBlock + 9,
        fakerFromBlock + 9
      );
      expect(pastEvents).toEqual({
        events: [
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent],
          [fakerEvent]
        ],
        breakpoint: fakerFromBlock + 9
      });
    });

    it('fromBlock = toBlock, step = 1, group.length = 0', async () => {
      expect.assertions(1);

      const fakerFromBlock = fakerBlockNum;
      const fakerToBlock = fakerFromBlock;

      contractQueryFilter.mockImplementationOnce(async () => []);

      const pastEvents = await newZKCWeb3Contract.getPastEventsFromSteped(
        fakerFromBlock,
        fakerToBlock,
        1
      );

      expect(pastEvents).toEqual({ events: [], breakpoint: fakerFromBlock });
    });
  });
});
