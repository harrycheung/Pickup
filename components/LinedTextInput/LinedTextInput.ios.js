
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
    };

    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  state: {
    borderBottomColor: string,
  }

  _onFocus() {
    this.setState({ borderBottomColor: colors.buttonBackground });
  }

  _onBlur() {
    this.setState({ borderBottomColor: this.props.borderBottomColor });
  }

  render() {
    const props = Object.assign({}, this.props);
    return (
      <View
        style={[props.style, {
          height: 38,
          marginBottom: 6,
          borderBottomWidth: 1,
          borderBottomColor: this.state.borderBottomColor,
        }]}
      >
        <TextInput
          {...props}
          style={gstyles.textInput}
          onFocus={(event) => {
            this._onFocus();
            this.props.onFocus(event);
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
