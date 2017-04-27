
import { NavigationActions } from 'react-navigation';

export const actions = {
  resetNavigation: (routeName) => {
    return NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName})],
    });
  },
  navigate: (routeName, params) => {
    return NavigationActions.navigate({routeName, params});
  },
  back: (key) => {
    return NavigationActions.back(key);
  },
}
