
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import { Actions as AuthActions } from '../../../actions/Auth';
import { Actions as SpinnerActions } from '../../../actions/Spinner';

class LoginToken extends React.Component {
  state: {
    message: string,
  };

  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    const { props } = this;
    props.login(props.navigation.state.params.token);
  }

  render() {
    if (this.props.spinning) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            color='darkgrey'
            size='large'
          />
          <Text style={{marginTop: 15}}>Logging in...</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text>
            {this.state.message}
          </Text>
        </View>
      )
    }
  }
}

LoginToken.propTypes = {
  spinning: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  spinning: state.spinner.spinning,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginToken);
