
// @flow

export const Types = {
  SHOW: 'Message/SHOW',
  CLEAR: 'Message/CLEAR',
};

export const Actions = {
  showMessage: (message: string, duration: number) => ({
    type: Types.SHOW, message, duration,
  }),
  clearMessage: () => ({ type: Types.CLEAR }),
};
