
// @flow

import firebase from 'firebase';

export const FBfunctions = 'us-central1-synapse-7afed.cloudfunctions.net';
const FirebaseConfig = {
  apiKey: 'AIzaSyDyoOkwBMJ9A5faAScoRx5EFC0N4C9Fc1c',
  authDomain: 'synapse-7afed.firebaseapp.com',
  databaseURL: 'https://synapse-7afed.firebaseio.com',
  projectId: 'synapse-7afed',
  storageBucket: 'synapse-7afed.appspot.com',
  messagingSenderId: '856653381451',
};

firebase.initializeApp(FirebaseConfig);

export const FBauth = firebase.auth();
export const FBref = (ref?: string) => firebase.database().ref(ref);
export const FBstorageRef = (ref?: string) => firebase.storage().ref(ref);
