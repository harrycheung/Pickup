
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, ViewPropTypes } from 'react-native';

import { colors, gstyles } from '../../config/styles';

class LinedTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      borderBottomColor: props.borderBottomColor,
      borderBottomWidth: 1,
    };

    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  state: {
    borderBottomColor: string,
    borderBottomWidth: number,
  }
  textInput: Object

  _onFocus() {
    this.setState({
      borderBottomColor: colors.buttonBackground,
      borderBottomWidth: 2,
    });
  }

  _onBlur() {
    this.setState({
      borderBottomColor: this.props.borderBottomColor,
      borderBottomWidth: 1,
    });
  }

  blur() {
    this.textInput.blur();
  }

  render() {
    const props = Object.assign({}, this.props);
    const container = this;

    return (
      <View
        style={[props.style, {
          height: 38,
          marginBottom: 6,
          borderBottomWidth: this.state.borderBottomWidth,
          borderBottomColor: this.state.borderBottomColor,
        }]}
      >
        <TextInput
          {...props}
          ref={(input) => { this.textInput = input; }}
          style={gstyles.textInput}
          onFocus={(event) => {
            container._onFocus();
            container.props.onFocus(event);
          }}
          onBlur={this._onBlur}
        />
      </View>
    );
  }
}

LinedTextInput.propTypes = {
  style: ViewPropTypes.style,
  borderBottomColor: PropTypes.string,
  onFocus: PropTypes.func,
};

LinedTextInput.defaultProps = {
  style: {},
  borderBottomColor: 'lightgray',
  onFocus: () => {},
};

export default LinedTextInput;
