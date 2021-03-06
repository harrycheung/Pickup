
// @flow

import React from 'react';
import { AppState, AsyncStorage, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import AppReducers from './reducers';
import AppWithNavigationState from './screens';
import rootSaga from './sagas';

console.ignoredYellowBox = ['Setting a timer'];

const logger = ({ getState }) => {
  return (next) => (action) => {
    // Call the next dispatch method in the middleware chain.
    console.log('DISPATCH:', action.type);
    let returnValue = next(action);
    // console.log('STATE:', getState().student);

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  }
}

const sagaMiddleware = createSagaMiddleware();
const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);
const middleware = applyMiddleware(sagaMiddleware, navMiddleware, logger);
const store = createStore(AppReducers, middleware);
sagaMiddleware.run(rootSaga);

const addListener = createReduxBoundAddListener('root');

class Root extends React.Component {
  state: {
    isStoreLoading: boolean,
    store: Object,
  }

  constructor(props: Object){
    super(props);

    this.state = {
      isStoreLoading: true,
      store: store,
    }
  }

  componentWillMount() {
    var self = this;
    // AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    // AsyncStorage.getItem('reduxStore')
    // .then((value) => {
    //   if (value && value.length) {
    //     let previousStore = JSON.parse(value);
    //     self.setState({
    //       store: createStore(AppReducers, previousStore, middleware),
    //       isStoreLoading: false,
    //     }, () => {
    //       // Rerun saga on previous store
    //       sagaMiddleware.run(rootSaga);
    //     });
    //     // self.setState({store: store, isStoreLoading: false});
    //   } else {
    //     self.setState({isStoreLoading: false});
    //   }
    // })
    // .catch((error) => {
      self.setState({store: store});
      self.setState({isStoreLoading: false});
    // })
  }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  // }
  //
  // _handleAppStateChange() {
  //   let storingValue = JSON.stringify(this.state.store.getState());
  //   AsyncStorage.setItem('reduxStore', storingValue);
  // }

  render() {
    if (this.state.isStoreLoading) {
      return <Text>Loading...</Text>;
    }

    return (
      <Provider store={this.state.store}>
        <AppWithNavigationState addListener={addListener} />
      </Provider>
    );
  }
}

export default Root;
