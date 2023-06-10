import { TranslateOptions } from '@midwayjs/i18n';
import { FrameworkErrorEnum } from './index';
import { RuleType } from '@midwayjs/validate';
import { BaseError } from './base.error';

export class ParameterError extends BaseError {
  constructor(message?: string, options?: TranslateOptions) {
    super(message, FrameworkErrorEnum.PARAM, options);
  }
}

interface ErrorMessages {
  message?: string;
  options?: TranslateOptions;
}

export const handleParameterError = (obj: ErrorMessages) => {
  return () => {
    return new ParameterError(obj.message, obj.options);
  };
};

export const handleParameterErrors = (messages: {
  [key: string]: ErrorMessages;
}) => {
  return (errors: RuleType.ErrorReport[]) => {
    if (errors.length === 0) {
      return;
    }
    const error = errors[0];
    const obj = messages[error.code] || messages['*'];
    if (obj) {
      return new ParameterError(obj.message, obj.options);
    } else {
      return new ParameterError(
        error.prefs.messages[error.prefs.errors.language][
          error.code
        ].toString(),
        void 0
      );
      // return new MidwayValidationError(
      //   error.prefs.messages[error.prefs.errors.language][
      //     error.code
      //   ].toString(),
      //   422,
      //   null
      // );
    }
  };
};
