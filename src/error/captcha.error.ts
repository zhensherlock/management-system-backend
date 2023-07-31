import { TranslateOptions } from '@midwayjs/i18n';
import { FrameworkErrorEnum } from './index';
import { BaseError } from './base.error';

export class CaptchaError extends BaseError {
  constructor(message?: string, options?: TranslateOptions) {
    super(message, FrameworkErrorEnum.CAPTCHA, options);
  }
}
