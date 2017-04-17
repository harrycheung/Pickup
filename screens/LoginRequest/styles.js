
import { StyleSheet } from 'react-native';

import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  activityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  activity: {
    height: 80,
  },
  resendButton: {
    height: 44,
    marginTop: 10,
    backgroundColor: colors.buttonBackground,
  },
  resendButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  },
  disabled: {
    opacity: 0.3,
  }
});
