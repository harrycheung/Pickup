
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, ViewPropTypes, View } from 'react-native';

import { colors, gstyles } from '../../config/styles';
import { chunkArray } from '../../helpers';

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
  },
  hspacer: {
    width: 5,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.buttonBackground,
    padding: 8,
  },
});

class Picker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: props.values.map(value => ({ value })),
      selected: props.value,
    };
  }

  state: {
    items: Array<string>,
    selected: boolean,
  }

  _renderRow(items) {
    return (
      <View key={items.join()} style={styles.row}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.item,
              item === this.state.selected ? styles.selected : {},
              index > 0 ? { marginLeft: 5 } : {},
            ]}
            onPress={() => {
              this.setState({ selected: item });
              this.props.onChange(item);
            }}
          >
            <Text style={gstyles.font18} numberOfLines={1}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.container}>
          {chunkArray(this.props.values.slice(), this.props.columns).map(value => (
            this._renderRow(value)
          ))}
        </View>
      </View>
    );
  }
}

Picker.propTypes = {
  columns: PropTypes.number,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  style: ViewPropTypes.style,
  value: PropTypes.string,
};

Picker.defaultProps = {
  columns: 1,
  onChange: () => {},
  style: {},
  value: '',
};

export default Picker;
