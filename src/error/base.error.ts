import { TranslateOptions } from '@midwayjs/i18n';
import { MidwayError } from '@midwayjs/core';
import { i18nPrefix } from './index';

export class BaseError extends MidwayError {
  constructor(message: string, code, options?: TranslateOptions) {
    const text = options
      ? JSON.stringify({ text: `${i18nPrefix}${message}`, options })
      : message;
    super(text, code);
  }
}
