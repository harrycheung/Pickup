
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Button from '../../../components/Button';

class EscortLevel extends React.Component {
  static navigationOptions = {
    title: ({ state }) => ('Escort ' + state.params.level),
    headerBackTitle: 'Back',
  };

  render() {
    return (
      <View />
    );
  }
}

EscortLevel.PropTypes = {
  level: PropTypes.string.isRequired,
};

export default EscortLevel;
