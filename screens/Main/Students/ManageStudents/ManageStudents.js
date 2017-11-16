
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors, gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import CachedImage from '../../../../components/CachedImage';
import MessageView from '../../../../components/MessageView';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as StudentActions } from '../../../../actions/Student';

const filterStudents = (students, relationships) => (
  students.filter(student => (
    typeof student === 'object' && relationships.includes(student.relationship)
  ))
);

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
          <Icon name="md-add" size={30} color="white" />
        </TouchableOpacity>
      ),
    })
  );

  static _renderSeparator = () => (
    <View style={styles.separator} />
  );

  constructor(props) {
    super(props);

    this.state = {
      mine: filterStudents(props.students, ['Parent']),
      others: filterStudents(props.students, ['Caregiver', 'Family', 'Friend']),
      admin: filterStudents(props.students, ['Admin']),
    };

    this._renderRow = this._renderRow.bind(this);
  }

  state: {
    mine: Array<Object>,
    others: Array<Object>,
    admin: Array<Object>,
  }

  componentWillMount() {
    this.props.listenStudents(this.props.uid);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mine: filterStudents(nextProps.students, ['Parent']),
      others: filterStudents(nextProps.students, ['Caregiver', 'Family', 'Friend']),
      admin: filterStudents(nextProps.students, ['Admin']),
    });
  }

  componentWillUnmount() {
    this.props.unlistenStudents();
  }

  _renderRow(student, section) {
    if (typeof student === 'object') {
      const touchable = section.title === 'Your students' || section.title === 'Admin students';
      let RowElement = View;
      if (touchable) {
        RowElement = TouchableOpacity;
      }

      return (
        <RowElement
          style={[styles.student, gstyles.flexCenter, gstyles.marginH15]}
          onPress={() => this.props.navigate('EditStudent', { student })}
        >
          <CachedImage
            style={[gstyles.profilePic50]}
            source={{ uri: student.image }}
          />
          <View style={styles.studentInfo}>
            <Text style={gstyles.font18}>
              {student.firstName} {student.lastInitial} ({student.grade.replace('_', '/')})
            </Text>
            <Text style={gstyles.font14}>
              { student.relationship }
            </Text>
          </View>
          <View style={gstyles.flex1} />
          {touchable &&
            <Icon name="ios-arrow-forward" size={30} color={colors.buttonBackground} />
          }
        </RowElement>
      );
    }
    return <View />;
  }

  render() {
    const sections = [];
    if (this.state.mine.length > 0) {
      sections.push({ data: this.state.mine, title: 'Your students' });
    }
    if (this.state.others.length > 0) {
      sections.push({ data: this.state.others, title: 'Other students' });
    }
    if (this.props.admin && this.state.admin.length > 0) {
      sections.push({ data: this.state.admin, title: 'Admin students' });
    }

    return (
      <MessageView style={gstyles.flex1}>
        <SectionList
          renderItem={({ item, section }) => this._renderRow(item, section)}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                backgroundColor: colors.buttonBackground,
                paddingVertical: 2,
              }}
            >
              <Text style={[gstyles.marginH15, { color: 'white' }]}>
                {section.title}
              </Text>
            </View>
          )}
          sections={sections}
          ItemSeparatorComponent={ManageStudents._renderSeparator}
        />
      </MessageView>
    );
  }
}

ManageStudents.propTypes = {
  uid: PropTypes.string.isRequired,
  admin: PropTypes.bool.isRequired,
  students: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  listenStudents: PropTypes.func.isRequired,
  unlistenStudents: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  uid: state.user.uid,
  admin: state.user.admin,
  students: state.student.students,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(StudentActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageStudents);
