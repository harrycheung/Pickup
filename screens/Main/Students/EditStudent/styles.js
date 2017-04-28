
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  deleteButton: {
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.buttonBackground,
  },
  deleteButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  }
});
