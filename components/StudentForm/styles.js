
// @flow

import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: colors.buttonBackground,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  margin: {
    marginTop: 10,
  },
  studentImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#bdc3c7',
  },
  input: {
    height: 44,
    paddingHorizontal: 5,
  },
  pickerLabel: {
    alignSelf: 'flex-start',
  },
  picker: {
    alignSelf: 'stretch',
    marginTop: 5,
  },
  submitButton: {
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.buttonBackground,
  },
  submitButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  }
});