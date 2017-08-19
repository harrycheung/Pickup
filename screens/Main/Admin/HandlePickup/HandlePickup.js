
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { gstyles } from '../../../../config/styles';
import { truncate } from '../../../../helpers';
import Button from '../../../../components/Button';
import PickupMessages from '../../../../components/PickupMessages';
import KeyboardAwareView from '../../../../components/KeyboardAwareView';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as AdminActions } from '../../../../actions/Admin';

class HandlePickup extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return { title: params ? params.title : '' };
  };

  constructor(props) {
    super(props);

    this._release = this._release.bind(this);
  }

  componentWillMount() {
    this.props.listenPickup(this.props.pickup);
  }

  componentDidMount() {
    const names = [];
    Object.keys(this.props.pickup.students).forEach((key) => {
      names.push(this.props.pickup.students[key].name);
    });
    this.props.navigation.setParams({ title: truncate(names.join(', '), 20) });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.pickup !== null;
  }

  componentWillUnmount() {
    this.props.unlistenPickup();
    this.props.clearPickup();
  }

  _release(pickup, student) {
    Alert.alert(
      'Confirm release',
      null,
      [
        { text: 'Cancel', onPress: null, style: 'cancel' },
        { text: 'OK',
          onPress: () => this.props.releaseStudent(pickup, this.props.user, student),
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    const { pickup, user } = this.props;
    const students = [];
    Object.keys(pickup.students).forEach((key) => {
      const student = pickup.students[key];
      const escort = student.escort.uid === user.uid;
      let actions = [];
      if (student.released) {
        actions = [(
          <Text key="released" style={gstyles.font18}>
            released by {escort ? 'You' : student.escort.name}
          </Text>
        )];
      } else if (escort) {
        actions = [(
          <Button
            key="cancel"
            style={gstyles.flex1}
            onPress={() => this.props.cancelEscort(pickup, user, student)}
            content="Cancel"
            backgroundColor="darkgray"
          />
        ), (
          <View key="spacer" style={gstyles.width10} />
        ), (
          <Button
            key="release"
            style={gstyles.flex1}
            onPress={() => this._release(pickup, student)}
            content="Release"
          />
        )];
      } else if (student.escort.uid === '') {
        actions = [(
          <Button
            key="escort"
            style={gstyles.flex1}
            onPress={() => this.props.escortStudent(pickup, user, student)}
            content="Escort"
          />
        )];
      } else {
        actions = [(
          <Text key="escort" style={gstyles.font14}>
            escorted by {student.escort.name}
          </Text>
        )];
      }

      students.push((
        <View
          key={student.key}
          style={[gstyles.flexCenter, styles.studentRequest]}
        >
          <View style={[gstyles.flex1, styles.student]}>
            <Image
              style={[gstyles.profilePic80, { marginLeft: 5 }]}
              source={{ uri: student.image }}
            />
            <Text style={gstyles.font18}>
              {student.name} ({student.grade})
            </Text>
          </View>
          <View style={[gstyles.flex1, styles.actionsContainer]}>
            {actions}
          </View>
        </View>
      ));
    });

    return (
      <KeyboardAwareView style={gstyles.flex1}>
        <View style={[gstyles.marginH15, gstyles.marginTop10, styles.request]}>
          {students}
          <View style={styles.requestor}>
            <Image
              style={[gstyles.profilePic40, { marginRight: 5 }]}
              source={{ uri: this.props.pickup.requestor.image }}
            />
            <Text style={gstyles.font14}>
              {pickup.requestor.name} @ {pickup.location} in {pickup.vehicle}
            </Text>
          </View>
        </View>
        <View style={styles.separator}>
          <Text style={styles.text}>messages</Text>
        </View>
        <PickupMessages
          user={this.props.user}
          pickup={this.props.pickup}
          postMessage={this.props.postMessage}
          hideRequest
        />
      </KeyboardAwareView>
    );
  }
}


HandlePickup.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  pickup: PropTypes.object,
  postMessage: PropTypes.func.isRequired,
  listenPickup: PropTypes.func.isRequired,
  unlistenPickup: PropTypes.func.isRequired,
  clearPickup: PropTypes.func.isRequired,
  escortStudent: PropTypes.func.isRequired,
  cancelEscort: PropTypes.func.isRequired,
  releaseStudent: PropTypes.func.isRequired,
};

HandlePickup.defaultProps = {
  pickup: null,
};

const mapStateToProps = state => ({
  user: state.user,
  pickup: state.pickup.pickup,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(AdminActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HandlePickup);
