
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { SegmentedControlIOS, ViewPropTypes } from 'react-native';

const Picker = (props: Object) => (
  <SegmentedControlIOS
    values={props.values}
    style={props.style}
    onChange={(event) => {
      const index = event.nativeEvent.selectedSegmentIndex;
      props.onChange(props.values[index]);
    }}
    selectedIndex={props.values.indexOf(props.value)}
  />
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
