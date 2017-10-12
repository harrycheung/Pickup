
// @flow

import moment from 'moment';

const Buffer = require('buffer').Buffer;

export const validPhoneNumber = (phoneNumber: string) => (
  phoneNumber.length === 10 && !isNaN(phoneNumber) && Number(phoneNumber) < 10000000000
);

export const merge = (a: Object, b: Object) => Object.assign({}, a, b);

export const truncate = (str: string, n: number) => (
  ((str.length > n) ? `${str.substr(0, n - 1)}...` : str)
);

export const chunkArray = (array: Array<any>, size: number) => {
  const arrays = [];
  while (array.length > 0) {
    arrays.push(array.splice(0, size));
  }
  return arrays;
};

export const convertToByteArray = (input) => {
  const binaryString = new Buffer(input, 'base64').toString('binary');
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const guid = () => {
  const s4 = () => (
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  );

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const objectArray = (obj: Object) => (
  Object.keys(obj).map(key => Object.assign({}, obj[key], { key }))
);

export const todayStr = () => moment().format('YYYYMMDD');
