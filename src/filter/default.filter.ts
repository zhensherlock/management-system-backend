import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { FrameworkErrorEnum } from '../error/enum';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    return {
      code: FrameworkErrorEnum.UNKNOWN,
      message: err.message,
    };
  }
}
