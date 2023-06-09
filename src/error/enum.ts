import { registerErrorCode } from '@midwayjs/core';

export const FrameworkErrorEnum = registerErrorCode('hy', {
  WARNING: 10000,
  UNKNOWN: 10001,
  COMMON: 10002,
  PARAM: 10003,
} as const);
