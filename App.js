
// @flow

import React from 'react';
import { AppState, AsyncStorage, Text } from 'react-native';
import { addNavigationHelpers } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import AppNavigator from './screens';
import AuthReducer from './reducers/Auth';
import DataReducer from './reducers/Data';
import rootSaga from './sagas';

const reducers = combineReducers({
  nav: (state, action) => (
    AppNavigator.router.getStateForAction(action, state)
  ),
  auth: AuthReducer,
  data: DataReducer,
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
    // Call the next dispatch method in the middleware chain.
    console.log('will dispatch', action);
    let returnValue = next(action);
    console.log('state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  }
}

const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware, logger);
const store = createStore(reducers, middleware);
sagaMiddleware.run(rootSaga);

class App extends React.Component {
  state: {
    isStoreLoading: boolean,
    store: Object,
  }

  constructor(props: Object){
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
        // self.setState({store: createStore(reducers, initialStore, middleware)});
        self.setState({store: store});
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

export default App;
