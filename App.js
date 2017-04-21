
import React from 'react';
import { AppState, AsyncStorage, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { DrawerNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import Icon from 'react-native-vector-icons/Ionicons';

import AddStudentScreen from './screens/AddStudent';
import HomeScreen from './screens/Home';
import HistoryScreen from './screens/History';
import LaunchScreen from './screens/Launch';
import LoginScreen from './screens/Login';
import LoginRequestScreen from './screens/LoginRequest';
import AwaitingPickupScreen from './screens/AwaitingPickup';

import authReducer from './reducers/auth';
import dataReducer from './reducers/data';
import rootSaga from './sagas';

const StackScreen = (rootScreen, otherScreens) => {
  return StackNavigator({
    root: {
      screen: rootScreen,
      navigationOptions: {
        header: (navigation) => ({
          left: (
            <TouchableOpacity
              onPress={() => navigation.navigate('DrawerOpen')}
              style={styles.menuButton}
            >
              <Icon name='md-menu' size={30} color='#000000' />
            </TouchableOpacity>
          ),
        }),
      },
    },
    ...otherScreens
  });
};

const MainNavigator = DrawerNavigator({
  Home: {screen: StackScreen(HomeScreen, {AwaitingPickup: {screen: AwaitingPickupScreen}})},
  History: {screen: StackScreen(HistoryScreen)},
  AddStudent: {screen: StackScreen(AddStudentScreen)},
}, {
  drawerWidth: 200,
});

const AppNavigator = StackNavigator({
  Launch: {screen: LaunchScreen},
  Login: {screen: LoginScreen},
  LoginRequest: {screen: LoginRequestScreen},
  Main: {screen: MainNavigator},
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: {visible: false}
  }
});

const appReducer = combineReducers({
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
  auth: authReducer,
  data: dataReducer,
});

@connect(state => ({
  nav: state.nav,
}))

class AppWithNavigationState extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const logger = ({ getState }) => {
  return (next) => (action) => {
    console.log('will dispatch', action);

    // Call the next dispatch method in the middleware chain.
    let returnValue = next(action);

    console.log('state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  }
}

const sagaMiddleware = createSagaMiddleware()
const store = createStore(appReducer, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(rootSaga);

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isStoreLoading: false,
      store: store,
    }
  }

  componentWillMount() {
    var self = this;
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    this.setState({isStoreLoading: true});
    AsyncStorage.getItem('reduxStore')
    .then((value) => {
      if (value && value.length) {
        let initialStore = JSON.parse(value)
        self.setState({store: createStore(reducers, initialStore, middleware)});
      } else {
        self.setState({store: store});
      }
      self.setState({isStoreLoading: false});
    })
    .catch((error) => {
      self.setState({store: store});
      self.setState({isStoreLoading: false});
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange(nextAppState) {
    let storingValue = JSON.stringify(this.state.store.getState())
    AsyncStorage.setItem('reduxStore', storingValue);
  }

  render() {
    if (this.state.isStoreLoading) {
      return <Text>Loading...</Text>;
    } else {
      return (
        <Provider store={this.state.store}>
          <AppWithNavigationState />
        </Provider>
      );
    }
  }
}

var styles = StyleSheet.create({
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 15,
  },
});

export default App;
