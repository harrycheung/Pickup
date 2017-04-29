
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { Actions as AuthActions } from '../../actions/Auth';

class Launch extends React.Component {
  componentDidMount() {
    this.props.loadAuth();
  }

  render() {
    return (
      <View />
    );
  }
}

Launch.propTypes = {
  loadAuth: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Launch);
