
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  request: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  studentImage: {
    marginRight: 5,
    borderWidth: 2,
  },
  unescort: {
    borderColor: 'red',
  },
  escort: {
    borderColor: 'yellow',
  },
  released: {
    borderColor: 'green',
  },
  separator: {
    height: 1,
    marginHorizontal: 60,
    borderWidth: 0.5,
    borderColor: 'lightgray',
  }
});
