import ms, { StringValue } from 'ms';
import * as dayjs from 'dayjs';
import { isNil, isDate } from 'lodash';

export const formatToMS = (value: StringValue): number => {
  return ms(value);
};

export const dateTransformer = {
  from: (value: Date | number | string) => {
    if (isNil(value)) {
      return null;
    }

    return dayjs(isDate(value) ? (<Date>value).getTime() : value).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  },
  to: () => new Date(),
};
