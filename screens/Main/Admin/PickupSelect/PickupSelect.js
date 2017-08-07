
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import { time } from '../../../../helpers';
import { FBref } from '../../../../helpers/firebase';
import { Actions as PickupActions } from '../../../../actions/Pickup';

class PickupSelect extends React.Component {
  state: {
    pickups: Object[],
    dataSource: ListView.DataSource,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.grade,
  });

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      pickups: [],
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    const { grade } = this.props.navigation.state.params;
    const query = FBref('/pickups').orderByChild(`grades/${grade}`).equalTo(true);

    query.on('child_added', (snapshot) => {
      let pickup = snapshot.val();
      pickup.key = snapshot.key;
      const pickups = this.state.pickups.concat(pickup);
      this.setState({
        pickups,
        dataSource: this.state.dataSource.cloneWithRows(pickups),
      });
    });

    query.on('child_removed', (snapshot) => {
      const pickups = this.state.pickups.filter((request) => {
        return request.key !== snapshot.key;
      });
      this.setState({
        pickups,
        dataSource: this.state.dataSource.cloneWithRows(pickups),
      });
    });

    query.on('child_changed', (snapshot) => {
      let pickup = snapshot.val();
      pickup.key = snapshot.key;
      const pickups = this.state.pickups.map((pickup) => {
        return pickup.key == pickup.key ? pickup : pickup;
      });
      this.setState({
        pickups,
        dataSource: this.state.dataSource.cloneWithRows(pickups),
      });
    });
  }

  componentWillUnmount() {
    FBref('/pickups').off();
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }

  _renderRow(pickup, sectionID, rowID) {
    let students = [];
    for (let studentKey in pickup.students) {
      const student = pickup.students[studentKey];

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
          source={require('../../../../images/max.png')}
        />
      ));
    }

    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        style={styles.request}
        onPress={() => this.props.handlePickup(pickup)}
      >
        {students}
        <View style={gstyles.flex1} />
        <Icon name='ios-arrow-forward' size={30} color={colors.buttonBackground} />
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return <View key={`${sectionID}-${rowID}`} style={styles.separator} />
  }
}

PickupSelect.propTypes = {
  handlePickup: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(PickupActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
