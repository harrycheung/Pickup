
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import * as C from '../../../../config/constants';
import { colors, gstyles } from '../../../../config/styles';
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
      grades: C.Levels.map(level => ({ key: level })),
      locations: Object.keys(C.Locations).map(location => ({ key: location })),
    };
  }

  state: {
    grades: string[],
    locations: string[],
  };

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <SectionList
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => this.props.navigate('PickupSelect', { title: item.key })}
            >
              <View
                style={[
                  gstyles.flexRow,
                  gstyles.flexCenter,
                  gstyles.marginH15,
                  { height: 64 },
                ]}
              >
                <Text style={gstyles.font18}>{item.key}</Text>
                <View style={gstyles.flex1} />
                <Icon name="ios-arrow-forward" size={30} color={colors.buttonBackground} />
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                backgroundColor: colors.buttonBackground,
                paddingVertical: 2,
              }}
            >
              <Text style={[gstyles.marginH15, { color: 'white' }]}>
                {section.title}
              </Text>
            </View>
          )}
          sections={[
            { data: this.state.grades, title: 'Levels' },
            { data: this.state.locations, title: 'Locations' },
          ]}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                marginHorizontal: 60,
                borderWidth: 0.5,
                borderColor: colors.lightGrey,
              }}
            />
          )}
        />
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
