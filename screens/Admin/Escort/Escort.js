
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Button from '../../../components/Button';

class Escort extends React.Component {
  static navigationOptions = {
    title: ({ state }) => (state.params.level),
    headerBackTitle: 'Back',
  };

  render() {
    return (
      <View />
    );
  }
}

Escort.propTypes = {
  level: PropTypes.string.isRequired,
};

export default Escort;
