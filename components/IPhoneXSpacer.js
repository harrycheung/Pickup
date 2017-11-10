
// @flow

import React from 'react';
import { View } from 'react-native';

import { isIPhoneX } from '../helpers';

const IPhoneXSpacer = () => (
  <View
    style={{
      height: isIPhoneX() ? 25 : 0,
    }}
  />
);

export default IPhoneXSpacer;
