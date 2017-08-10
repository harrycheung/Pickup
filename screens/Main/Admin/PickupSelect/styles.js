
// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    borderColor: 'yellow',
  },
  escort: {
    borderColor: 'green',
  },
  released: {
    opacity: 0.3,
    borderWidth: 0,
  },
  separator: {
    height: 1,
    marginHorizontal: 60,
    borderWidth: 0.5,
    borderColor: 'lightgray',
  },
});
