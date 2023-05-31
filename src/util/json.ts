import { isObject } from 'lodash';

export const isValidJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const tryParseJSON = str => {
  try {
    const obj = JSON.parse(str);
    if (isObject(obj)) {
      return obj;
    }
  } catch (e) {
    // handle error
  }

  return str;
};
