
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  messagesContainer: {
    marginHorizontal: 15,
    paddingBottom: 15,
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
    color: 'white',
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
    maxWidth: '80%',
    flexDirection: 'column',
  },
  messageText: {
    fontSize: 14,
    color: 'white',
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
    backgroundColor: 'darkgray',
  },
  request: {
    flexDirection: 'column',
  },
  composeContainer: {
    height: 44,
    borderTopWidth: 2,
    borderColor: 'lightgray',
  },
  timestamp: {
    alignSelf: 'flex-end',
    marginTop: 5,
    fontSize: 10,
    color: 'white',
  },
  escortButton: {
    height: 44,
    backgroundColor: colors.buttonBackground,
  },
  escortButtonText: {
    fontSize: 18,
    color: 'white',
  }
});
