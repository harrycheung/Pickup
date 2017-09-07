
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
    marginTop: 15,
    marginHorizontal: 10,
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 5,
    maxWidth: 140,

  },
  dialog: {
    borderWidth: 3,
    borderColor: colors.buttonBackground,
    borderRadius: 5,
    margin: 15,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },
  configureModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
