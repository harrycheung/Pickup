
// @flow

export const Types = {
  START: 'Spinner/START',
  STOP: 'Spinner/STOP',
};

export const Actions = {
  start: () => ({ type: Types.START }),
  stop: () => ({ type: Types.STOP }),
};
