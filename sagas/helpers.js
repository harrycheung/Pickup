
// @flow

import { eventChannel } from 'redux-saga';

export const firebaseChannel = (ref: Object, eventType: string) => (
  eventChannel((emitter) => {
    ref.on(eventType, snapshot => emitter(snapshot));

    return () => ref.off();
  })
);
