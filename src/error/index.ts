import { TranslateOptions } from '@midwayjs/i18n';
import { MidwayValidationError, RuleType } from '@midwayjs/validate';
import { TranslateValidateError } from './validate.error';

interface ErrorMessages {
  message?: string;
  options?: TranslateOptions;
}

export const handleError = (obj: ErrorMessages) => {
  return () => {
    return new TranslateValidateError(obj.message, obj.options);
  };
};

export const handleErrors = (messages: { [key: string]: ErrorMessages }) => {
  return (errors: RuleType.ErrorReport[]) => {
    if (errors.length === 0) {
      return;
    }
    const error = errors[0];
    const obj = messages[error.code] || messages['*'];
    if (obj) {
      return new TranslateValidateError(obj.message, obj.options);
    } else {
      return new MidwayValidationError(
        error.prefs.messages[error.prefs.errors.language][
          error.code
        ].toString(),
        422,
        null
      );
    }
  };
};
