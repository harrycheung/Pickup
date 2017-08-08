
// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  request: {
    flexDirection: 'column',
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  studentRequest: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    marginBottom: 10,
  },
  student: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestor: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  requestorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  requestorText: {
    fontSize: 14,
    color: 'black',
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
