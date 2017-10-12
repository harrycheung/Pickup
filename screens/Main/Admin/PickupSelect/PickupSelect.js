
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { SectionList, TouchableOpacity, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import { objectArray } from '../../../../helpers';
import MessageView from '../../../../components/MessageView';
import CachedImage from '../../../../components/CachedImage';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as AdminActions } from '../../../../actions/Admin';

class PickupSelect extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  static _renderSeparator() {
    return <View style={styles.separator} />;
  }

  constructor(props) {
    super(props);

    this.state = {
      active: [],
      completed: [],
    };

    this._renderRow = this._renderRow.bind(this);
  }

  state: {
    active: Array<Object>,
    completed: Array<Object>,
  }

  componentDidMount() {
    const { grade, location } = this.props.navigation.state.params;
    this.props.listenPickups(grade, location);
  }

  componentWillReceiveProps(nextProps) {
    let pickups = objectArray(nextProps.pickups);
    pickups = pickups.sort((a, b) => b.createdAt - a.createdAt);
    this.setState({
      active: pickups.filter(item => !('completedAt' in item)),
      completed: pickups.filter(item => 'completedAt' in item),
    });
  }

  componentWillUnmount() {
    this.props.unlistenPickups();
  }

  _renderRow(pickup) {
    const students = Object.keys(pickup.students).map((key) => {
      const student = pickup.students[key];

      let studentStyle = styles.unescort;
      if (student.released) {
        studentStyle = styles.released;
      } else if (student.escort.uid !== '') {
        studentStyle = styles.escort;
      }

      return (
        <CachedImage
          key={student.key}
          style={[gstyles.profilePic50, styles.studentImage, studentStyle]}
          source={{ uri: student.image }}
        />
      );
    });

    return (
      <TouchableOpacity
        style={[styles.request, gstyles.marginH15]}
        onPress={() => this.props.handlePickup(pickup)}
      >
        {students}
        <View style={gstyles.flex1} />
        <Icon name="ios-arrow-forward" size={30} color={colors.buttonBackground} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <SectionList
          renderItem={({ item }) => this._renderRow(item)}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                backgroundColor: colors.buttonBackground,
                paddingVertical: 2,
              }}
            >
              <Text style={[gstyles.marginH15, { color: 'white' }]}>
                {section.key}
              </Text>
            </View>
          )}
          sections={[
            { data: this.state.active, key: 'Active' },
            { data: this.state.completed, key: 'Completed' },
          ]}
          ItemSeparatorComponent={PickupSelect._renderSeparator}
        />
      </MessageView>
    );
  }
}

PickupSelect.propTypes = {
  navigation: PropTypes.object.isRequired,
  pickups: PropTypes.object.isRequired,
  handlePickup: PropTypes.func.isRequired,
  listenPickups: PropTypes.func.isRequired,
  unlistenPickups: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  pickups: state.admin.pickups,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(AdminActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
