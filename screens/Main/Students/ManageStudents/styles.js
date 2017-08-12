
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

export default StyleSheet.create({
  student: {
    height: 64,
    flexDirection: 'row',
  },
  studentInfo: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  separator: {
    height: 1,
    marginHorizontal: 60,
    borderWidth: 0.5,
    borderColor: colors.lightGrey,
  },
});
