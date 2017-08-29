
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, SectionList, TouchableOpacity, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as AdminActions } from '../../../../actions/Admin';
import MessageView from '../../../../components/MessageView';

class PickupSelect extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.grade,
  });

  static _renderSeparator() {
    return <View style={styles.separator} />;
  }

  constructor(props) {
    super(props);

    this.state = {
      live: [],
      completed: [],
    };

    this._renderRow = this._renderRow.bind(this);
  }

  state: {
    live: Array<Object>,
    completed: Array<Object>,
  }

  componentDidMount() {
    this.props.listenPickups(this.props.navigation.state.params.grade);
  }

  componentWillReceiveProps(nextProps) {
    let pickups = [];
    Object.keys(nextProps.pickups).forEach((key) => {
      pickups.push(Object.assign({}, nextProps.pickups[key], { key }));
    });
    pickups = pickups.sort((a, b) => b.createdAt - a.createdAt);
    this.setState({
      live: pickups.filter(item => !('completedAt' in item)),
      completed: pickups.filter(item => 'completedAt' in item),
    });
  }

  componentWillUnmount() {
    this.props.unlistenPickups();
  }

  _renderRow(pickup) {
    const students = [];
    Object.keys(pickup.students).forEach((key) => {
      const student = pickup.students[key];

      let studentStyle = styles.unescort;
      if (student.released) {
        studentStyle = styles.released;
      } else if (student.escort.uid !== '') {
        studentStyle = styles.escort;
      }

      students.push((
        <Image
          key={student.key}
          style={[gstyles.profilePic50, styles.studentImage, studentStyle]}
          source={{ uri: student.image }}
        />
      ));
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
          renderSectionHeader={({ section }) => {
            if (section.key === 'Completed') {
              return (
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
              );
            }
            return null;
          }}
          sections={[
            { data: this.state.live, key: 'Live' },
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
