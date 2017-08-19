
// @flow

import { StyleSheet } from 'react-native';
import Expo from 'expo';

export const colors = {
  background: '#f2f2f2',
  errorText: '#FA3256',
  headerText: '#444444',
  buttonBackground: '#027fbf',
  buttonText: '#ffffff',
  inputColor: '#027fbf',
  inputBackground: '#FFFFFF',
  inputDivider: '#E4E2E5',

  darkGrey: '#8e8e93',
  lightGrey: '#ceced2',
  black: '#000000',
  white: '#ffffff',
};

export const gstyles = StyleSheet.create({
  statusBarMargin: {
    marginTop: Expo.Constants.statusBarHeight,
  },
  flex1: {
    flex: 1,
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  width10: {
    width: 10,
  },
  font14: {
    fontSize: 14,
  },
  font18: {
    fontSize: 18,
  },
  font22: {
    fontSize: 22,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginH15: {
    marginHorizontal: 15,
  },
  textInput: {
    height: 44,
    paddingHorizontal: 5,
    fontSize: 18,
  },
  button: {
    height: 44,
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: colors.buttonBackground,
  },
  buttonText: {
    fontSize: 18,
    color: colors.buttonText,
  },
  grayButton: {
    backgroundColor: 'darkgray',
  },
  profilePic40: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePic50: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePic80: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePic100: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePic200: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#bdc3c7',
  },
  redBorder: {
    borderWidth: 2,
    borderColor: 'red',
  },
  yellowBorder: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
});
