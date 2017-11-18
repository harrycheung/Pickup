
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { BlurView } from 'expo';

import { colors, gstyles } from '../config/styles';

const Modal = props => (
  <BlurView
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'stretch',
    }}
    tint="light"
    intensity={70}
  >
    <View style={{ flex: 1 }} />
    <View
      style={[{
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'lightgray',
        overflow: 'hidden',
      }, gstyles.marginH15]}
    >
      {props.title !== '' &&
        <View
          style={[{
            height: 44,
            backgroundColor: colors.buttonBackground,
          }, gstyles.flexCenter]}
        >
          <Text style={[gstyles.font18, { color: 'white' }]}>
            {props.title}
          </Text>
        </View>
      }
      <View>
        {props.children}
      </View>
    </View>
    <View style={{ flex: 1 }} />
  </BlurView>
);

Modal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

Modal.defaultProps = {
  children: null,
  title: '',
};

export default Modal;
