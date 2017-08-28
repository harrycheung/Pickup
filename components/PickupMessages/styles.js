
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  messagesContainer: {
    marginHorizontal: 15,
    paddingBottom: 15,
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
  students: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  studentRequest: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  studentImage: {
    borderWidth: 2,
    marginRight: 5,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
