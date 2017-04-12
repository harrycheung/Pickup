
import { StyleSheet } from 'react-native';

import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  input: {
    height: 44,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  loginButton: {
    height: 44,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.buttonBackground,
  },
  loginButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  },
  disabled: {
    opacity: 0.3,
  }
});
