
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
import { Actions as StudentActions } from '../../../../actions/Student';

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

  componentWillMount() {
    this.props.listenStudents(this.props.uid);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.students !== nextProps.students) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.students),
      });
    }
  }

  componentWillUnmount() {
    this.props.unlistenStudents();
  }

  _renderRow(student, sectionID, rowID) {
    if (typeof student === 'object') {
      const relationship = student.relationships[this.props.uid];
      const parent = relationship === 'Parent';
      let RowElement = View;
      if (parent) {
        RowElement = TouchableOpacity;
      }

      return (
        <RowElement
          style={[styles.student, gstyles.flexCenter]}
          key={`${sectionID}-${rowID}`}
          onPress={() => this.props.navigate('EditStudent', { student })}
        >
          <Image
            style={[gstyles.profilePic50]}
            source={{ uri: student.image }}
          />
          <View style={styles.studentInfo}>
            <Text style={gstyles.font18}>
              {student.firstName} {student.lastInitial} ({student.grade})
            </Text>
            <Text style={gstyles.font14}>
              {typeof relationship === 'object' ? relationship.role : relationship }
            </Text>
          </View>
          <View style={gstyles.flex1} />
          {parent &&
            <Icon name="ios-arrow-forward" size={30} color={colors.buttonBackground} />
          }
        </RowElement>
      );
    }
    return <View key={`${sectionID}-${rowID}`} />
  }

  render() {
    return (
      <View style={[gstyles.marginH15, gstyles.flex1]}>
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
  uid: PropTypes.string.isRequired,
  students: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  listenStudents: PropTypes.func.isRequired,
  unlistenStudents: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  uid: state.user.uid,
  students: state.student.students,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(StudentActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageStudents);
