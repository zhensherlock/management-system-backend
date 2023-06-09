import { TranslateOptions } from '@midwayjs/i18n';
import { MidwayError } from '@midwayjs/core';
import { FrameworkErrorEnum } from './enum';

export class CommonWarning extends MidwayError {
  constructor(text?: string, options?: TranslateOptions) {
    super(JSON.stringify({ text, options }), FrameworkErrorEnum.WARNING);
  }
}
