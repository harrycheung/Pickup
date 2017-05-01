
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
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  studentName: {
    fontSize: 22,
    color: colors.white,
  },
  senderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageContainer: {
    marginTop: 15,
    flexDirection: 'row',
  },
  message: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 14,
    color: colors.white,
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
  withoutSender: {
    backgroundColor: colors.buttonBackground,
  },
  withSender: {
    flexDirection: 'row',
    backgroundColor: colors.darkGrey,
  }
});
