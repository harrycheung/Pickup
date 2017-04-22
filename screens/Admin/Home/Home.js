
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import drawerHeader from '../../../helpers/DrawerHeader';
import Button from '../../../components/Button';
import { actions as navActions } from '../../../actions/navigation';

class Home extends React.Component {
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
      levels: ['L1', 'L2', 'L3', 'L4'],
    };
  }

  render() {
    const { levels } = this.state;
    const levelButtons = levels.map((level) => {
      return (
        <Button
          key={level}
          style={styles.levelButton}
          onPress={this._selectLevel.bind(this, level)}
        >
          <Text style={styles.levelButtonText}>{level}</Text>
        </Button>
      );
    });

    return (
      <View style={styles.container}>
        {levelButtons}
      </View>
    );
  }

  _selectLevel(level) {
    this.props.navigate('Escort', {level});
  }
}

Home.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(navActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Home);
