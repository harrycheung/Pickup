
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as c from '../../../../config/constants';
import styles from './styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import { Actions as NavActions } from '../../../../actions/Navigation';

class Home extends React.Component {
  state: {
    grades: string[],
  };

  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      title: 'Admin',
      drawerLabel: 'Admin',
      headerBackTitle: '',
    })
  );

  constructor(props) {
    super(props);

    this.state = {
      grades: c.Levels,
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
    this.props.navigate('EscortSelect', {grade});
  }
}

Home.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Home);
