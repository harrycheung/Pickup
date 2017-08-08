
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { gstyles } from '../../../config/styles';
import { Actions as AuthActions } from '../../../actions/Auth';

class LoginToken extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  state: {
    message: string,
  };

  componentDidMount() {
    const { props } = this;
    props.login(props.navigation.state.params.token);
  }

  render() {
    if (this.props.spinning) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating
            color="darkgrey"
            size="large"
          />
          <Text style={{ marginTop: 15 }}>Logging in...</Text>
        </View>
      );
    }

    return (
      <View style={[gstyles.flex1, gstyles.flexCenter]}>
        <Text>
          {this.state.message}
        </Text>
      </View>
    );
  }
}

LoginToken.propTypes = {
  spinning: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  spinning: state.spinner,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(AuthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginToken);
