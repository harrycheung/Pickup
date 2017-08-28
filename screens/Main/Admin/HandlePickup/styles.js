
// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  request: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  studentRequest: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  student: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  requestor: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  separator: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'darkgray',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    marginVertical: 5,
    color: 'darkgray',
  },
});
