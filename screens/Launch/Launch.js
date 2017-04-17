
import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import constants from '../../config/constants';
import { actions as AuthActions } from '../../actions/auth';
import { actions as NavigationActions } from '../../actions/navigation';

class Launch extends React.Component {
  componentDidMount() {
    this.props.loadAuth();
    // try {
    //   const value = await AsyncStorage.getItem(constants.LoginKey);
    //   if (value !== null) {
    //     this.props.resetNavigation('Main');
    //   } else {
    //     this.props.resetNavigation('Login');
    //   }
    // } catch (error) {
    //   this.props.resetNavigation('Login');
    // }
  }

  render() {
    return (
      <View />
    );
  }
}

Launch.propTypes = {
  resetNavigation: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
  ...bindActionCreators(NavigationActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Launch);
