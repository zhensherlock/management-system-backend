import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { SystemConfigService } from '../../../service/system_config.service';
import { ApiTags } from '@midwayjs/swagger';
import { BaseUserController } from './base/base.user.controller';
import { CommonError } from '../../../error';
import { omit } from 'lodash';
import { Role } from '../../../decorator/role.decorator';

@ApiTags(['system_config'])
@Controller('/api/user/sys')
export class SystemConfigController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  systemConfigService: SystemConfigService;

  @Role(['admin', 'school', 'security', 'education'])
  @Get('/get', { summary: '用户-查询系统信息' })
  async getSystemConfig() {
    const mdl = await this.systemConfigService.getSystemConfig();
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return omit(mdl, ['deletedDate']);
  }
}
