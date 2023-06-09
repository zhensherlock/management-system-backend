import { registerErrorCode } from '@midwayjs/core';

export const FrameworkErrorEnum = registerErrorCode('hy', {
  UNKNOWN: 10000,
  COMMON: 10001,
  PARAM: 10002,
} as const);
