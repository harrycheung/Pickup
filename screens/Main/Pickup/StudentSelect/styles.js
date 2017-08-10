
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

export default StyleSheet.create({
  students: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  student: {
    height: 125,
    marginTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.buttonBackground,
  },
  pickup: {
    borderWidth: 3,
    borderColor: colors.buttonBackground,
    borderRadius: 5,
    margin: 15,
    padding: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
