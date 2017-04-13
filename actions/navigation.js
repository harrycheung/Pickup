
import { NavigationActions } from 'react-navigation';

export const actions = {
  loginRequest: (phoneNumber) => {
    return NavigationActions.navigate({ routeName: 'LoginRequest', params: { phoneNumber }});
  },
}
