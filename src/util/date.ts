import ms, { StringValue } from 'ms';
import * as dayjs from 'dayjs';
import { isNil, isDate } from 'lodash';

export const formatToMS = (value: StringValue): number => {
  return ms(value);
};

export const createDateTransformer = {
  from: (value: Date | number | string) => {
    if (isNil(value)) {
      return null;
    }

    return dayjs(isDate(value) ? (<Date>value).getTime() : value).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  },
  to: value => {
    return value || new Date();
  },
};

export const updatedDateTransformer = {
  from: (value: Date | number | string) => {
    if (isNil(value)) {
      return null;
    }

    return dayjs(isDate(value) ? (<Date>value).getTime() : value).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  },
  to: () => {
    return new Date();
  },
};
