
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

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
  studentRequest: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  student: {
    flex: 1,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentName: {
    fontSize: 18,
  },
  studentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 5,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionsSpacer: {
    width: 10,
  },
  button: {
    flex: 1,
    backgroundColor: colors.buttonBackground,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'darkgray',
  },
  buttonText: {
    fontSize: 18,
    color: colors.buttonText,
  },
  request: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 5,
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
    height: 1,
    marginHorizontal: 60,
    borderWidth: 0.5,
    borderColor: 'lightgray',
  }
});
