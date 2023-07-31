import { registerErrorCode } from '@midwayjs/core';

export * from './common.warning';
export * from './parameter.error';
export * from './common.error';
export * from './captcha.error';

export const i18nPrefix = 'i18n:';

export const FrameworkErrorEnum = registerErrorCode('hy', {
  WARNING: 10000,
  UNKNOWN: 10001,
  COMMON: 10002,
  PARAM: 10003,
  CAPTCHA: 10004,
} as const);
