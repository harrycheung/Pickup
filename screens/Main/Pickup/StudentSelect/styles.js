
// @flow

import { Dimensions, StyleSheet } from 'react-native';
import { colors, gstyles } from '../../../../config/styles';

const wide = Dimensions.get('window').width > 400;

export default StyleSheet.create({
  students: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingBottom: 44 + 10,
  },
  student: {
    marginTop: 15,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: wide ? 3 : 2,
    borderColor: 'transparent',
    borderRadius: 5,
    maxWidth: wide ? 140 : 120,
  },
  studentImage: StyleSheet.flatten(wide ? gstyles.profilePic100 : gstyles.profilePic80),
  studentName: {
    fontSize: wide ? 18 : 14,
  },
  dialog: {
    borderWidth: 3,
    borderColor: colors.buttonBackground,
    borderRadius: 5,
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
