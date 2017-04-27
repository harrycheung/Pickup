
import { StyleSheet } from 'react-native';
import { colors } from '../../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
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
  pickupButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.buttonBackground,
  },
  pickupButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  }
});
