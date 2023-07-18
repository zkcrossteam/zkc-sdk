import { faker } from '@faker-js/faker';

export const fakerAddressFn = () =>
  faker.string.hexadecimal({ length: 40, prefix: '0x' });

export const fakerBlockNumFn = () =>
  faker.number.int({
    min: 1000000000,
    max: 9999999999
  });

export const fakerChainIdNumFn = () => faker.number.int(99999);

export const fakerDataTotal = () => faker.number.int(1000);

export const fakerEventNameFn = () => faker.string.alpha(15);

export const fakerString20Fn = () => faker.string.alpha(20);

export const fakerSymbolFn = () => faker.string.alpha(3).toUpperCase();

export const fakerURLFn = () => faker.internet.url({ appendSlash: false });

export const fakerObjectFn = () => ({
  [fakerString20Fn()]: fakerString20Fn()
});
