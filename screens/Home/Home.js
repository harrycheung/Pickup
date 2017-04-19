
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import styles from './styles';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Synapse Pickup',
    drawer: {
      label: 'Home',
    },
  };
  render() {
    const students = this.props.students.map((student) => {
      return (
        <View key={student.key} style={styles.student}>
          <Image style={styles.studentImage} source={require('../../images/max.png')} />
          <Text style={styles.studentName}>{student.name}</Text>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.students}>
          {students}
        </ScrollView>
        <TouchableOpacity style={styles.pickupButton} >
          <Text style={styles.pickupButtonText}>Pickup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Home.propTypes = {
  students: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  students: state.data.students,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
