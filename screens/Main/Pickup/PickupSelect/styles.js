
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  message: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageText: {
    fontSize: 18,
  },
  messageButton: {
    marginTop: 15,
  },
  students: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  student: {
    height: 125,
    marginTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 18,
  },
  studentImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  pickupButtons: {
    flexDirection: 'row',
  }
});
