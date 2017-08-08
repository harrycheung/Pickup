
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import { FBref } from '../../../../helpers/firebase';
import { Actions as PickupActions } from '../../../../actions/Pickup';
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
    pickups: Object[],
    dataSource: ListView.DataSource,
  };

  componentDidMount() {
    const { grade } = this.props.navigation.state.params;
    const query = FBref('/pickups').orderByChild(`grades/${grade}`).equalTo(true);

    query.on('child_added', (snapshot) => {
      const pickup = snapshot.val();
      pickup.key = snapshot.key;
      const pickups = this.state.pickups.concat(pickup);
      this.setState({
        pickups,
        dataSource: this.state.dataSource.cloneWithRows(pickups),
      });
    });

    query.on('child_removed', (snapshot) => {
      const pickups = this.state.pickups.filter(request => request.key !== snapshot.key);
      this.setState({
        pickups,
        dataSource: this.state.dataSource.cloneWithRows(pickups),
      });
    });

    query.on('child_changed', (snapshot) => {
      const pickup = snapshot.val();
      pickup.key = snapshot.key;
      const pickups = this.state.pickups.map(item => (item.key === pickup.key ? item : pickup));
      this.setState({
        pickups,
        dataSource: this.state.dataSource.cloneWithRows(pickups),
      });
    });
  }

  componentWillUnmount() {
    FBref('/pickups').off();
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
      <MessageView style={styles.container}>
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
  handlePickup: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(null, mapDispatchToProps)(PickupSelect);
