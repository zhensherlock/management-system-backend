import { Utils } from '@midwayjs/core';

export const generateUUID = (withoutStripe = true): string => {
  const uuid = Utils.randomUUID();
  return withoutStripe ? uuid.replace(/-/g, '') : uuid;
};
