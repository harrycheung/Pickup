
import React from 'react';
import { SegmentedControlIOS } from 'react-native';

class RelationshipPicker extends React.Component {
  render() {
    return (
      <SegmentedControlIOS
        values={this.props.values}
        style={this.props.style}
      />
    );
  }
}

export default RelationshipPicker;
