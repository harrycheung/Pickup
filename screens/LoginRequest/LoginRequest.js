
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';
import Button from '../../components/Button';
import { actions as AuthActions } from '../../actions/auth';
import { actions as NavigationActions } from '../../actions/navigation';

class LoginRequest extends React.Component {
  componentDidMount() {
    console.log(this.props.navigation.state.params.phoneNumber);
  }

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
          onPress={() => {}}
        >
          <Text style={styles.resendButtonText}>Re-send login link</Text>
        </Button>
        <View style={{flex: 1}} />
      </View>
    );
  }
}

LoginRequest.propTypes = {
  isRequesting: React.PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isRequesting: state.auth.isRequesting,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(AuthActions, dispatch),
  ...bindActionCreators(NavigationActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginRequest);
