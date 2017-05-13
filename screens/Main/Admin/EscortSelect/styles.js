
// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 15,
  },
  student: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  requestorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 5,
  },
  requestorName: {
    flex: 1,
    fontSize: 22,
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    marginHorizontal: 60,
    borderWidth: 0.5,
    borderColor: 'lightgray',
  }
});
