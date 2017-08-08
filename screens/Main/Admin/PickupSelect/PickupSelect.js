
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as AdminActions } from '../../../../actions/Admin';
import MessageView from '../../../../components/MessageView';

const maxPNG = require('../../../../images/max.png');

class PickupSelect extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.grade,
  });

  static _renderSeparator(sectionID, rowID) {
    return <View key={`${sectionID}-${rowID}`} style={styles.separator} />;
  }

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      pickups: [],
      dataSource: ds.cloneWithRows([]),
    };
    this._renderRow = this._renderRow.bind(this);
  }

  state: {
    pickups: Array<Object>,
    dataSource: ListView.DataSource,
  }

  componentDidMount() {
    this.props.listenPickups(this.props.navigation.state.params.grade);
  }

  componentWillReceiveProps(nextProps) {
    const pickups = [];
    Object.keys(nextProps.pickups).forEach((key) => {
      pickups.push(Object.assign({}, nextProps.pickups[key], { key }));
    });
    this.setState({
      pickups,
      dataSource: this.state.dataSource.cloneWithRows(pickups),
    });
  }

  componentWillUnmount() {
    this.props.unlistenPickups();
  }

  _renderRow(pickup, sectionID, rowID) {
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
          source={maxPNG}
        />
      ));
    });

    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        style={styles.request}
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
      <MessageView style={[gstyles.flex1, gstyles.marginH15]}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={PickupSelect._renderSeparator}
          enableEmptySections
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
