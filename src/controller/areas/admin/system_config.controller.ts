import { Inject, Controller, Get, Put, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ajaxSuccessResult } from '../../../util';
import { SystemConfigService } from '../../../service/system_config.service';
import { UpdateSystemConfigDTO } from '../../../dto/areas/admin/system_confirm.dto';
import { SystemConfig } from '../../../entity/system_config.entity';
import { ApiBody, ApiTags } from '@midwayjs/swagger';
import { BaseAdminController } from './base/base.admin.controller';

@ApiTags(['system_config'])
@Controller('/api/admin/sys')
export class SystemConfigController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  systemConfigService: SystemConfigService;

  @Get('/get', { summary: '查询系统信息' })
  async getSystemConfig() {
    const mdl = await this.systemConfigService.getSystemConfig();
    return ajaxSuccessResult(mdl);
  }

  @Put('/set', { summary: '修改系统信息' })
  @ApiBody({ description: '系统信息' })
  async updateSystemConfig(@Body() dto: UpdateSystemConfigDTO) {
    const mdl = await this.systemConfigService.updateSystemConfig(
      <SystemConfig>dto
    );
    return ajaxSuccessResult(mdl);
  }
}
