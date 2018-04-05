
// @flow

import { Dimensions, Platform } from 'react-native';

import moment from 'moment';
import { colors } from '../config/styles';

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

const deg2rad = deg => deg * (Math.PI / 180);

const distance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
    (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const distanceFromSchool = (lat, lon) => (distance(37.476539, -122.200109, lat, lon) * 0.6).toFixed(2)

export const navigationOptions = {
  headerStyle: {
    backgroundColor: colors.buttonBackground,
  },
  headerTintColor: 'white',
};

// Starting with react-navigation 1.5.8, the app bar is being treated
// with a default height. We need to shrink it a little bit to make it
// work on android.
if (Platform.OS === 'android') {
  navigationOptions.headerStyle['marginTop'] = -26;
  navigationOptions.headerStyle['paddingTop'] = 26;
}

export const isIPhoneX = () => (
  Platform.OS === 'ios' && Dimensions.get('window').height === 812
);
