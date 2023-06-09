import { TranslateOptions } from '@midwayjs/i18n';
import { MidwayError } from '@midwayjs/core';
import { FrameworkErrorEnum } from './enum';

export class CommonError extends MidwayError {
  constructor(text?: string, options?: TranslateOptions) {
    super(JSON.stringify({ text, options }), FrameworkErrorEnum.COMMON);
  }
}
