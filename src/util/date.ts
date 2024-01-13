import ms from 'ms';
import dayjs, { OpUnitType } from 'dayjs';
import { isNil, isDate } from 'lodash';

export const formatToMS = value => {
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

export const getEndOfTime = (date: Date, unit: OpUnitType = 'day') => {
  return dayjs(date).endOf(unit).toDate();
};

export const getStartOfTime = (date: Date, unit: OpUnitType = 'day') => {
  return dayjs(date).startOf(unit).toDate();
};
