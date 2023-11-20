import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { MidwayI18nService } from '@midwayjs/i18n';
import { tryParseJSON } from '../util';
import { TranslateValidateError } from '../error/validate.error';

@Catch(TranslateValidateError)
export class TranslateValidateErrorFilter {
  async catch(err: TranslateValidateError, ctx: Context) {
    let message = err.message;
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    const obj: any = tryParseJSON(err.message);
    if (obj && obj.message.startsWith('i18n:')) {
      const i18nKey = obj.message.match(/^i18n:(.*)$/)[1];
      message = i18nService.translate(i18nKey, obj.options);
      return { status: 422, message };
    }
    return { status: 422, message: err.message };
  }
}
