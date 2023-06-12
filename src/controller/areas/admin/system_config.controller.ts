import { Inject, Controller, Get, Put, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { SystemConfigService } from '../../../service/system_config.service';
import { UpdateSystemConfigDTO } from '../../../dto/areas/admin/system_confirm.dto';
import { SystemConfig } from '../../../entity/system_config.entity';
import { ApiBody, ApiTags } from '@midwayjs/swagger';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
import { omit } from 'lodash';
import { Role } from '../../../decorator/role.decorator';

@ApiTags(['system_config'])
@Controller('/api/admin/sys')
export class SystemConfigController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  systemConfigService: SystemConfigService;

  @Role(['admin'])
  @Get('/get', { summary: '查询系统信息' })
  async getSystemConfig() {
    const mdl = await this.systemConfigService.getSystemConfig();
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['admin'])
  @Put('/set', { summary: '修改系统信息' })
  @ApiBody({ description: '系统信息' })
  async updateSystemConfig(@Body() dto: UpdateSystemConfigDTO) {
    const mdl = await this.systemConfigService.updateSystemConfig(
      <SystemConfig>dto
    );
    return omit(mdl, ['deletedDate']);
  }
}
