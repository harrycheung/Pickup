
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
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

import authReducer from './reducers/auth';
import rootSaga from './sagas';

const StackScreen = (Screen) => {
  return StackNavigator({
    root: {
      screen: Screen,
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
    }
  });
};

const MainNavigator = DrawerNavigator({
  Home: { screen: StackScreen(HomeScreen) },
  History: { screen: StackScreen(HistoryScreen) },
  AddStudent: { screen: StackScreen(AddStudentScreen) },
}, {
  drawerWidth: 200,
});

const AppNavigator = StackNavigator({
  Launch: { screen: LaunchScreen },
  Login: { screen: LoginScreen },
  LoginRequest: { screen: LoginRequestScreen },
  Main: { screen: MainNavigator },
}, {
  headerMode: 'screen',
  navigationOptions: {
    header: { visible: false }
  }
});

const appReducer = combineReducers({
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
  authReducer,
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

const sagaMiddleware = createSagaMiddleware()
const store = createStore(appReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
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
