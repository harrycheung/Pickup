
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
  }
});
