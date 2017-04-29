
// @flow

import { NavigationActions } from 'react-navigation';

export const Actions = {
  resetNavigation: (routeName: string) => {
    return NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName})],
    });
  },
  navigate: (routeName: string, params: Object) => {
    return NavigationActions.navigate({routeName, params});
  },
  back: (key: string) => {
    return NavigationActions.back(key);
  },
}
