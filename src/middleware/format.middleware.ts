import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { isString, isObject } from 'lodash';

@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      let message = 'success';
      let data = void 0;
      if (result === null) {
        ctx.status = 200;
      }
      if (isString(result)) {
        message = result;
      }
      if (isObject(result)) {
        data = result;
      }
      return {
        traceId: ctx.traceId,
        code: ctx.status,
        message,
        data,
      };
    };
  }

  static getName(): string {
    return 'format';
  }

  match(ctx) {
    return ctx.path.indexOf('/api') !== -1;
  }
}
