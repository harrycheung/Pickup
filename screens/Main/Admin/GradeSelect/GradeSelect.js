
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as c from '../../../../config/constants';
import styles from './styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import { Actions as NavActions } from '../../../../actions/Navigation';

class Home extends React.Component {
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

    this._selectLevel = this._selectLevel.bind(this);
  }

  state: {
    grades: string[],
  };

  _selectLevel(grade) {
    this.props.navigate('PickupSelect', { grade });
  }

  render() {
    const { grades } = this.state;
    const gradeButtons = grades.map(grade => (
      <Button
        key={grade}
        style={styles.gradeButton}
        onPress={() => this._selectLevel(grade)}
        content={grade}
      />
    ));

    return (
      <View style={styles.container}>
        {gradeButtons}
      </View>
    );
  }
}

Home.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Home);
