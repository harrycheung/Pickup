
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import { Actions as NavActions } from '../../../../actions/Navigation';

class ManageStudents extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Manage Students',
      drawerLabel: 'Manage Students',
      headerBackTitle: 'Manage',
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddStudent')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
            marginHorizontal: 15,
          }}
        >
          <Icon name="md-add" size={30} color={colors.black} />
        </TouchableOpacity>
      ),
    })
  );

  static _renderSeparator = (sectionID, rowID) => (
    <View key={`${sectionID}-${rowID}`} style={styles.separator} />
  );

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.students),
    };

    this._renderRow = this._renderRow.bind(this);
  }

  state: {
    dataSource: ListView.DataSource,
  };

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.students),
    });
  }

  _renderRow(student, sectionID, rowID) {
    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        onPress={() => this.props.navigate('EditStudent', { student })}
      >
        <View style={styles.student}>
          <Image
            style={[gstyles.profilePic50, styles.studentImage]}
            source={{ uri: student.image }}
          />
          <Text style={styles.studentName}>
            {student.firstName} {student.lastInitial} ({student.grade})
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={ManageStudents._renderSeparator}
          enableEmptySections
        />
      </View>
    );
  }
}

ManageStudents.propTypes = {
  students: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  students: state.student.students,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageStudents);
