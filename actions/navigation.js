
import { NavigationActions } from 'react-navigation';

export const actions = {
  resetNavigation: (routeName) => {
    return NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
  },
  loginRequest: (phoneNumber) => {
    return NavigationActions.navigate({ routeName: 'LoginRequest', params: { phoneNumber }});
  },
}
