import { TranslateOptions } from '@midwayjs/i18n';
import { FrameworkErrorEnum } from './index';
import { BaseError } from './base.error';

export class CommonError extends BaseError {
  constructor(message?: string, options?: TranslateOptions) {
    super(message, FrameworkErrorEnum.COMMON, options);
  }
}
