import { MidwayValidationError } from '@midwayjs/validate';
import { TranslateOptions } from '@midwayjs/i18n';

export class TranslateValidateError extends MidwayValidationError {
  constructor(message?: string, options?: TranslateOptions) {
    super(JSON.stringify({ message, options }), 422, null);
  }
}
