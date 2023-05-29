import { Inject, Controller, Get, Put, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ajaxSuccessResult } from '../../../util';
import { SystemConfigService } from '../../../service/system_config.service';
import { UpdateSystemConfigDTO } from '../../../dto/areas/admin/system_confirm.dto';
import { SystemConfig } from '../../../entity/system_config.entity';

@Controller('/api/admin/sys')
export class SystemConfigController {
  @Inject()
  ctx: Context;

  @Inject()
  systemConfigService: SystemConfigService;

  @Get('/get')
  async getSystemConfig() {
    const mdl = await this.systemConfigService.getSystemConfig();
    return ajaxSuccessResult(mdl);
  }

  @Put('/set')
  async updateSystemConfig(@Body() dto: UpdateSystemConfigDTO) {
    const mdl = await this.systemConfigService.updateSystemConfig(
      <SystemConfig>dto
    );
    return ajaxSuccessResult(mdl);
  }
}
