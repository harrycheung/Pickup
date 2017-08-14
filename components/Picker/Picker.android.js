
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Picker as RNPicker, ViewPropTypes } from 'react-native';

const Picker = (props: Object) => (
  <RNPicker
    selectedValue={props.value}
    onValueChange={props.onChange}
    style={props.style}
  >
    {props.values.map(item => (
      <RNPicker.Item key={item} label={item} value={item} />
    ))}
  </RNPicker>
);

Picker.propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  style: ViewPropTypes.style,
  value: PropTypes.string,
};

Picker.defaultProps = {
  onChange: () => {},
  style: {},
  value: '',
};

export default Picker;
