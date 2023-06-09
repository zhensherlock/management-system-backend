import { TranslateOptions } from '@midwayjs/i18n';
import { MidwayError } from '@midwayjs/core';
import { FrameworkErrorEnum } from './enum';
import { TranslateValidateError } from './validate.error';
import { RuleType } from '@midwayjs/validate';

export class ParameterError extends MidwayError {
  constructor(text?: string, options?: TranslateOptions) {
    super(JSON.stringify({ text, options }), FrameworkErrorEnum.PARAM);
  }
}

interface ErrorMessages {
  message?: string;
  options?: TranslateOptions;
}

export const handleParameterError = (obj: ErrorMessages) => {
  return () => {
    return new TranslateValidateError(obj.message, obj.options);
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
        null
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
