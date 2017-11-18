
// @flow

import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  timestamp: {
    fontSize: 10,
  },
  header: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    color: 'white',
    textAlign: 'center',
  },
});
