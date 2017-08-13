
// @flow

import { eventChannel } from 'redux-saga';

import { FBref } from '../helpers/firebase';

export const firebaseChannel = (ref: Object, eventType: string) => {
  let channelRef = ref;
  if (typeof ref === 'string') {
    channelRef = FBref(ref);
  }

  return eventChannel((emitter) => {
    channelRef.on(eventType, snapshot => emitter(snapshot));

    return () => channelRef.off();
  });
};
