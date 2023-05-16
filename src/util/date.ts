import ms, { StringValue } from 'ms';

export const formatToMS = (value: StringValue): number => {
  return ms(value);
};
