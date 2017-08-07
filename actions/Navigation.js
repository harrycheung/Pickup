
// @flow

import { NavigationActions } from 'react-navigation';

export const Actions = {
  resetNavigation: (routeName: string, params?: Object) => {
    return NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName, params})],
      key: null,
    });
  },
  navigate: (routeName: string, params?: Object) => {
    return NavigationActions.navigate({routeName, params});
  },
  back: (key?: string) => {
    return NavigationActions.back(key);
  },
  setParams: (params: Object) => {
    return NavigationActions.setParams(params);
  },
}

// resetNestedNavigation: (routes: Array) => {
//   const buildActions = (routes) => {
//     const navigators = routes.shift();
//     if (typeof navigators === 'Array') {
//       const actions = navigators.map((navigator) => NavigationActions.navigate({routeName: navigator}));
//       return NavigationActions.navigate({
//         index: actions.length - 1,
//         actions,
//         key: null,
//       });
//     } else {
//       return NavigationActions.navigate({
//         index: 0,
//         actions: [buildActions(routes)],
//         key: null,
//       });
//     }
//   }
//   return NavigationActions.reset({
//     index: 0,
//     actions: buildActions(routes),
//     key: null,
//   });
// },
