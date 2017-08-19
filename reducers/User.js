
// @flow

import { Types } from '../actions/User';
import { Types as AuthTypes } from '../actions/Auth';

const initialState = {
  uid: '',
  firstName: '',
  lastInitial: '',
  image: '',
  name: '',
  admin: false,
  vehicles: [],
};

export default (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case Types.SET:
      return {
        uid: action.uid,
        firstName: action.user.firstName,
        lastInitial: action.user.lastInitial,
        image: action.user.image || '',
        name: `${action.user.firstName} ${action.user.lastInitial}`,
        admin: action.user.admin || false,
        vehicles: action.user.vehicles || [],
      };

    case Types.CREATE:
    case Types.UPDATE:
      return {
        ...state,
        firstName: action.firstName,
        lastInitial: action.lastInitial,
        image: action.image,
      };

    case Types.ADD_VEHICLE: {
      const vehicles = state.vehicles.slice();
      vehicles.push(action.vehicle);
      const newState = {
        ...state,
        vehicles,
      };
      return newState;
    }

    case Types.REMOVE_VEHICLE: {
      const index = state.vehicles.indexOf(action.vehicle);
      if (index > -1) {
        return {
          ...state,
          vehicles: state.vehicles.slice(index, 1),
        };
      }
      return state;
    }

    case AuthTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
