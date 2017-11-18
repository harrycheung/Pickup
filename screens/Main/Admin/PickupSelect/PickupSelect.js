
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import styles from './styles';
import * as C from '../../../../config/constants';
import { colors, gstyles } from '../../../../config/styles';
import { objectArray, distanceFromSchool } from '../../../../helpers';
import drawerHeader from '../../../../components/DrawerHeader';
import MessageView from '../../../../components/MessageView';
import CachedImage from '../../../../components/CachedImage';
import Modal from '../../../../components/Modal';
import Picker from '../../../../components/Picker';
import { Actions as NavActions } from '../../../../actions/Navigation';
import { Actions as PickupActions } from '../../../../actions/Pickup';
import { Actions as AdminActions } from '../../../../actions/Admin';

class PickupSelect extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => (
    drawerHeader(navigation, screenProps, {
      drawerLabel: 'Admin: Pickups',
      title: 'Today\'s Pickups',
    })
  );

  static _renderSeparator() {
    return <View style={styles.separator} />;
  }

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      select: false,
      filter: C.PickupFilters[0],
      active: [],
      completed: [],
      selected: [],
    };

    this._renderRow = this._renderRow.bind(this);
    this._toggleSelect = this._toggleSelect.bind(this);
    this._release = this._release.bind(this);
  }

  state: {
    modal: boolean,
    select: boolean,
    filter: string,
    active: Array<Object>,
    completed: Array<Object>,
    selected: Array<string>,
  };

  componentDidMount() {
    this.props.listenPickups(this.state.filter);
  }

  componentWillReceiveProps(nextProps) {
    let pickups = objectArray(nextProps.pickups);
    pickups = pickups.sort((a, b) => b.createdAt - a.createdAt);
    this.setState({
      active: pickups.filter(item => !('completedAt' in item)),
      completed: pickups.filter(item => 'completedAt' in item),
    });
  }

  componentWillUnmount() {
    this.props.unlistenPickups();
  }

  _toggleSelect() {
    this.setState({ select: !this.state.select }, () => {
      this.props.navigation.setParams({
        selectText: this.state.select ? 'Select' : 'Release',
      });
      if (!this.state.select) {
        this.setState({ select: false, selected: [] });
      }
    });
  }

  _selectPickup(pickupKey) {
    if (this.state.selected.includes(pickupKey)) {
      this.setState({
        selected: this.state.selected.filter(key => key !== pickupKey),
      });
    } else {
      this.setState({
        selected: this.state.selected.concat(pickupKey),
      });
    }
  }

  _release() {
    this.props.releasePickups(this.state.selected.map((key) => {
      return Object.assign({}, this.props.pickups[key], { key });
    }));
    this.setState({ selected: [] });
  }

  _renderRow(pickup, section) {
    const students = Object.keys(pickup.students).map((key) => {
      const student = pickup.students[key];

      let studentStyle = styles.unescort;
      if (student.releaser.uid !== '') {
        studentStyle = styles.released;
      } else if (student.escort.uid !== '') {
        studentStyle = styles.escort;
      }

      return (
        <CachedImage
          key={student.key}
          style={[gstyles.profilePic50, styles.studentImage, studentStyle]}
          source={{ uri: student.image }}
        />
      );
    });

    const PickupCheckbox = (props) => {
      if (props.checked) {
        return (
          <Icon
            name="md-checkbox-outline"
            size={40}
            color={colors.buttonBackground}
            style={{ marginRight: 15 }}
          />
        );
      }
      return (
        <Icon
          name="md-square-outline"
          size={40}
          color={colors.buttonBackground}
          style={{ marginRight: 15 }}
        />
      );
    };

    return (
      <TouchableOpacity
        style={[gstyles.marginH15, { paddingVertical: 5 }]}
        onPress={() => {
          if (this.state.select && section.key !== 'Completed') {
            this._selectPickup(pickup.key);
          } else {
            this.props.handlePickup(pickup);
          }
        }}
      >
        <View style={[gstyles.flexRow, gstyles.flexCenter]}>
          {(this.state.select && section.key !== 'Completed') &&
            <PickupCheckbox checked={this.state.selected.includes(pickup.key)} />
          }
          <View style={gstyles.flex1}>
            <View style={[gstyles.flexRow, gstyles.flexCenter]}>
              {students}
              <View style={gstyles.flex1} />
              <Icon name="ios-arrow-forward" size={30} color={colors.buttonBackground} />
            </View>
            {pickup.completedAt === undefined ?
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ fontSize: 10 }}>
                  {distanceFromSchool(pickup.coordinates.latitude, pickup.coordinates.longitude)} miles away
                </Text>
                <View style={gstyles.flex1} />
                <Text style={{ fontSize: 10 }}>
                  {moment(pickup.createdAt).format('LT')}
                </Text>
              </View>
              :
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <View style={gstyles.flex1} />
                <Text style={{ fontSize: 10 }}>
                  {moment(pickup.completedAt).format('LT')}
                </Text>
              </View>
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <MessageView style={gstyles.flex1}>
        <View
          style={[{
            height: 30,
            backgroundColor: colors.buttonBackground,
            borderBottomColor: 'darkgray',
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingHorizontal: 15,
          }, gstyles.flexRow, gstyles.flexCenter]}
        >
          {this.state.select ?
            <TouchableOpacity
              onPress={this._toggleSelect}
              style={[gstyles.flex1, { alignItems: 'flex-start' }]}
            >
              <Text style={styles.header}>Cancel</Text>
            </TouchableOpacity>
            :
            <View style={gstyles.flex1} />
          }
          <TouchableOpacity
            onPress={() => { this.setState({ modal: true }); }}
          >
            <View style={[gstyles.flexRow, gstyles.flexCenter]}>
              <Text style={[styles.header, { marginRight: 10 }]}>
                {this.state.filter}
              </Text>
              <Icon name="md-arrow-dropdown" size={26} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.state.select ? this._release : this._toggleSelect}
            style={[gstyles.flex1, { alignItems: 'flex-end' }]}
          >
            <Text style={styles.header}>
              {this.state.select ? 'Release' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
        <SectionList
          renderItem={({ item, section }) => this._renderRow(item, section)}
          renderSectionHeader={({ section }) => (
            <View
              style={{
                backgroundColor: colors.buttonBackground,
                paddingVertical: 2,
              }}
            >
              <Text style={[gstyles.marginH15, { color: 'white' }]}>
                {section.key}
              </Text>
            </View>
          )}
          sections={[
            { data: this.state.active, key: 'Active' },
            { data: this.state.completed, key: 'Completed' },
          ]}
          ItemSeparatorComponent={PickupSelect._renderSeparator}
        />
        {this.state.modal &&
          <Modal title="Filter pickups">
            <Picker
              style={{
                margin: 15,
              }}
              values={C.PickupFilters.map(filter => filter.replace('_', '/'))}
              onChange={(filter) => {
                this.setState({ modal: false, filter }, () => {
                  this.props.unlistenPickups();
                  this.props.listenPickups(filter.replace('/', '_'));
                });
              }}
              columns={2}
            />
          </Modal>
        }
      </MessageView>
    );
  }
}

PickupSelect.propTypes = {
  navigation: PropTypes.object.isRequired,
  pickups: PropTypes.object.isRequired,
  handlePickup: PropTypes.func.isRequired,
  listenPickups: PropTypes.func.isRequired,
  unlistenPickups: PropTypes.func.isRequired,
  releasePickups: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
  pickups: state.admin.pickups,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(NavActions, dispatch),
  ...bindActionCreators(PickupActions, dispatch),
  ...bindActionCreators(AdminActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupSelect);
