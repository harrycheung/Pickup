
// @flow

import React from 'react';
import { View } from 'react-native';

import { isIPhoneX } from '../helpers';

const IPhoneXSpacer = () => (
  <View
    style={{
      height: isIPhoneX() ? 25 : 0,
      borderColor: 'red',
      borderWidth: 1,
    }}
  />
);

export default IPhoneXSpacer;
