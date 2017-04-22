
import { StyleSheet } from 'react-native';
import { colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  levelButton: {
    height: 44,
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: colors.buttonBackground,
  },
  levelButtonText: {
    fontSize: 18,
    color: colors.buttonText,
  }
});
