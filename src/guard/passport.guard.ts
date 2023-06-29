import { Guard, IGuard, getPropertyMetadata } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ROLE_META_KEY } from '../decorator/role.decorator';
import { Config } from '@midwayjs/decorator';
import { CommonError } from '../error';
import { intersection } from 'lodash';
import type { PassportOptions } from '../interface';

@Guard()
export class PassportGuard implements IGuard<Context> {
  @Config('app.security')
  securityConfig;

  async canActivate(
    context: Context,
    supplierClz,
    methodName: string
  ): Promise<boolean> {
    const { path } = context;
    const { ignore } = this.securityConfig;
    const exist = ignore.find(item => {
      return item === path;
    });
    if (exist) {
      return true;
    }

    // 从类元数据上获取角色信息
    const roleNameList =
      getPropertyMetadata<string[]>(ROLE_META_KEY, supplierClz, methodName) ||
      [];
    if (
      intersection(
        roleNameList,
        (<PassportOptions>context.currentPassport)?.roles || []
      ).length > 0
    ) {
      return true;
    }

    throw new CommonError('access_denied.message', { group: 'passport' });
  }
}
