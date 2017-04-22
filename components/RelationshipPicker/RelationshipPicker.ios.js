
import React from 'react';
import PropTypes from 'prop-types';
import { SegmentedControlIOS } from 'react-native';

class RelationshipPicker extends React.Component {
  render() {
    return (
      <SegmentedControlIOS
        values={this.props.values}
        style={this.props.style}
        onChange={(event) => {
          const index = event.nativeEvent.selectedSegmentIndex;
          this.props.onChange && this.props.onChange(this.props.values[index]);
        }}
      />
    );
  }
}

RelationshipPicker.propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  style: PropTypes.object,
}

export default RelationshipPicker;
