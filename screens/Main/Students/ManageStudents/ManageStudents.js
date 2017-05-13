
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import { colors } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import { Actions as NavActions } from '../../../../actions/Navigation';

class ManageStudents extends React.Component {
  state: {
    dataSource: ListView.DataSource,
  };

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
          <Icon name='md-add' size={30} color={colors.black} />
        </TouchableOpacity>
      )
    })
  );

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.students),
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.students),
    });
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

  _renderRow(student, sectionID, rowID) {
    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        onPress={() => this.props.navigate('EditStudent', {student})}
      >
        <View style={styles.student}>
          <Image
            style={styles.studentImage}
            source={require('../../../../images/max.png')}
          />
          <Text style={styles.studentName}>
            {student.firstName} {student.lastInitial}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return <View key={`${sectionID}-${rowID}`} style={styles.separator} />
  }
}

ManageStudents.propTypes = {
  students: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  students: state.student.students,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageStudents);
