
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import drawerHeader from '../../../helpers/DrawerHeader';
import Button from '../../../components/Button';
import { actions as navActions } from '../../../actions/navigation';

class Escort extends React.Component {
  static navigationOptions = {
    title: 'Select Level',
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
          <Text style={styles.levelButtonText}>Escort {level}</Text>
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
    this.props.navigate('EscortLevel', {level});
  }
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(navActions, dispatch),
});

export default connect(null, mapDispatchToProps)(Escort);
