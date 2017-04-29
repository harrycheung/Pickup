
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import drawerHeader from '../../../helpers/DrawerHeader';
import Button from '../../../components/Button';
import { Actions as NavActions } from '../../../actions/Navigation';

class Home extends React.Component {
  state: {
    grades: string[],
  };

  static navigationOptions = {
    title: 'Escort',
    drawer: {
      label: 'Escort',
    },
    header: drawerHeader,
  };

  constructor(props) {
    super(props);

    this.state = {
      grades: ['L1', 'L2', 'L3', 'L4'],
    };
  }

  render() {
    const { grades } = this.state;
    const gradeButtons = grades.map((grade) => {
      return (
        <Button
          key={grade}
          style={styles.gradeButton}
          onPress={this._selectLevel.bind(this, grade)}
        >
          <Text style={styles.gradeButtonText}>{grade}</Text>
        </Button>
      );
    });

    return (
      <View style={styles.container}>
        {gradeButtons}
      </View>
    );
  }

  _selectLevel(grade) {
    this.props.navigate('Escort', {grade});
  }
}

Home.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Home);
