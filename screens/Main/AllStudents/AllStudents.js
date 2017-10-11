
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { colors, gstyles } from '../../../config/styles';
import drawerHeader from '../../../components/DrawerHeader';
import MyButton from '../../../components/Button';
import MessageView from '../../../components/MessageView';
import CachedImage from '../../../components/CachedImage';
import LinedTextInput from '../../../components/LinedTextInput';
import { Actions as NavActions } from '../../../actions/Navigation';
import { Actions as AdminActions } from '../../../actions/Admin';

class AllStudents extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Search Students',
      headerBackTitle: 'Cancel',
      drawerLabel: 'AllStudents',
    })
  );

  static defaultProps = {
    pickup: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      students: [],
      disabled: true,
    };

    this._search = this._search.bind(this);
    this._selectStudent = this._selectStudent.bind(this);
    this._configure = this._configure.bind(this);
  }

  state: {
    searchText: string,
    students: Object[],
    disabled: boolean,
  }
  searchInput: Object

  _search() {
    this.props.searchStudents(this.state.searchText);
  }

  _selectStudent(selectedStudent) {
    if (this.state.students.includes(selectedStudent)) {
      this.setState({
        students: this.state.students.filter(student => (student !== selectedStudent)),
      });
    } else {
      this.setState({
        students: this.state.students.concat([selectedStudent]),
      });
    }
  }

  _configure() {
    this.props.navigate('ConfigurePickup', { students: this.state.students });
    this.setState({ students: [], disabled: true });
  }

  render() {
    let studentViews = null;
    if (this.props.students.length > 0) {
      studentViews = this.props.students.map((student) => {
        const selected = this.state.students.includes(student);
        return (
          <TouchableOpacity
            key={student.key}
            style={[styles.student, selected ? { borderColor: colors.buttonBackground } : {}]}
            onPress={() => this._selectStudent(student)}
          >
            <CachedImage
              style={styles.studentImage}
              source={{ uri: student.image }}
            />
            <Text style={[styles.studentName, gstyles.marginTop10]}>
              {student.firstName} {student.lastInitial} ({student.grade})
            </Text>
          </TouchableOpacity>
        );
      });
    }

    return (
      <MessageView style={[gstyles.flex1, gstyles.flexStart]}>
        <View
          style={[
            gstyles.flexStretch,
            gstyles.marginH15,
            gstyles.marginTop10,
            gstyles.flexRow,
          ]}
        >
          <LinedTextInput
            style={gstyles.flex1}
            placeholder="name"
            clearButtonMode="while-editing"
            onChangeText={text => this.setState({ searchText: text.trim() })}
          />
          <Button
            title="Search"
            onPress={this._search}
            disabled={this.state.searchText.length < 1}
          />
        </View>
        <ScrollView contentContainerStyle={[gstyles.marginH15, styles.students]}>
          {studentViews}
        </ScrollView>
        <MyButton
          style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}
          disabled={this.state.students.length < 1}
          onPress={this._configure}
          content="Pickup"
          round
        />
      </MessageView>
    );
  }
}

AllStudents.propTypes = {
  students: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  searchStudents: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  students: state.admin.students,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(AdminActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AllStudents);
