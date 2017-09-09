
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, ViewPropTypes, View } from 'react-native';

import { colors, gstyles } from '../../config/styles';
import { chunkArray } from '../../helpers';

const styles = StyleSheet.create({
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
    selected: string,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.selected) {
      this.setState({ selected: nextProps.value });
    }
  }

  _renderRow(items) {
    return (
      <View key={items.join()} style={styles.row}>
        {items.map((item, index) => (
          (item === this.state.selected ?
            <View
              key={item}
              style={[
                styles.item,
                styles.selected,
                index > 0 ? { marginLeft: 5 } : {},
              ]}
            >
              <Text style={gstyles.font18} numberOfLines={1}>
                {item}
              </Text>
            </View>
            :
            <TouchableOpacity
              key={item}
              style={[
                styles.item,
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
          )
        ))}
      </View>
    );
  }

  render() {
    return (
      <View style={this.props.style}>
        {chunkArray(this.props.values.slice(), this.props.columns).map(value => (
          this._renderRow(value)
        ))}
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
