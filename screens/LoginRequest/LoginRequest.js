
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';
import Button from '../../components/Button';
import { actions as AuthActions } from '../../actions/auth';

class LoginRequest extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.activityContainer}>
          <ActivityIndicator
            animating={this.props.isRequesting}
            style={styles.activity}
            size='large'
          />
        </View>
        <Button
          style={styles.resendButton}
          disabled={this.props.isRequesting}
          onPress={() => { this.props.login('harryToken') }}
        >
          <Text style={styles.resendButtonText}>Re-send login link</Text>
        </Button>
        <View style={{flex: 1}} />
      </View>
    );
  }
}

LoginRequest.propTypes = {
  isRequesting: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  isRequesting: state.auth.isRequesting,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRequest);
