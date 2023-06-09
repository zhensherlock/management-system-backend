import { Catch } from '@midwayjs/core';
import { MidwayValidationError } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';
import { MidwayI18nService } from '@midwayjs/i18n';
import { isObject } from 'lodash';
import { tryParseJSON } from '../util';

@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    let message = err.message;
    const code = err.code;
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    const obj = tryParseJSON(err.message);
    if (isObject(obj)) {
      message = obj.text;
      if (message.startsWith('i18n:')) {
        const i18nKey = message.match(/^i18n:(.*)$/)[1];
        message = i18nService.translate(i18nKey, obj.options);
      }
    }
    return {
      code,
      message,
    };
  }
}
