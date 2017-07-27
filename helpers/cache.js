
// @flow

import firebase from 'firebase';

import { fbref } from '.';

class Cache {
  path: string;
  cache: Object;

  constructor(path: string) {
    this.path = path;
    this.cache = {};
  }

  get(key: string) {
    if (key in this.cache) {
      return Promise.resolve(this.cache[key]);
    } else {
      return fbref(`${this.path}/${key}`).once('value').then((snapshot) => {
        const student = snapshot.val();
        student.key = snapshot.key;
        if (snapshot !== null) {
          this.cache[key] = student;
        }
        return Promise.resolve(student);
      });
    }
  }
}

export default Cache;
