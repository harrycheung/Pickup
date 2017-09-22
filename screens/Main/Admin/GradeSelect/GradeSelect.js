
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as C from '../../../../config/constants';
import { gstyles } from '../../../../config/styles';
import drawerHeader from '../../../../components/DrawerHeader';
import Button from '../../../../components/Button';
import MessageView from '../../../../components/MessageView';
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
      grades: C.Levels,
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
        style={{ marginHorizontal: 15, marginTop: 15 }}
        onPress={() => this._selectLevel(grade)}
        content={grade}
        round
      />
    ));

    return (
      <MessageView style={gstyles.flex1}>
        {gradeButtons}
      </MessageView>
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
