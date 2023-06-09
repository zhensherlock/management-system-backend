import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { FrameworkErrorEnum } from '../error';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    return {
      traceId: ctx.traceId,
      code: FrameworkErrorEnum.UNKNOWN,
      message: err.message,
    };
  }
}
