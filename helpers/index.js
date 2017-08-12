
// @flow

export const validPhoneNumber = (phoneNumber: string) => (
  phoneNumber.length === 10 && !isNaN(phoneNumber) && Number(phoneNumber) < 10000000000
);

export const merge = (a: Object, b: Object) => Object.assign({}, a, b);

export const time = (timestamp: number) => (
  (new Date(timestamp))
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
);

export const truncate = (str: string, n: number) => (
  ((str.length > n) ? `${str.substr(0, n - 1)}&hellip;` : str)
);

const atob = (input) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  const str = input.replace(/=+$/, '');
  let output = '';

  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }

  for (let bc = 0, bs = 0, buffer, i = 0;
    buffer = str.charAt(i++);
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};

export const convertToByteArray = (input) => {
  const binaryString = atob(input);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const guid = () => {
  const s4 = () => (
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  );

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
