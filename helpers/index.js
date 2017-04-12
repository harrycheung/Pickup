
import { NavigationActions } from 'react-navigation';

export const navigateTo = (navigation, routeName, params) => {
  const actionToDispatch = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName, params })],
  })
  navigation.dispatch(actionToDispatch);
}
