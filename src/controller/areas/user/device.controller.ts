import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { DeviceService } from '../../../service/device.service';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/device')
export class DeviceController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  deviceService: DeviceService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security'])
  @Get('/list', { summary: '用户-查询可用设备列表' })
  @ApiQuery({})
  async getDeviceList() {
    const user = this.ctx.currentUser;
    const where = user.organizationUserMappings.map(item => ({
      organizationId: item.organizationId,
    }));
    const devices = await this.deviceService.getList({
      where,
    });
    return {
      devices,
    };
  }
}
