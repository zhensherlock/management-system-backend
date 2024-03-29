import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { RoleService } from '../../../service/role.service';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/role')
export class RoleController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  roleService: RoleService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['education'])
  @Get('/list', { summary: '用户-角色列表' })
  @ApiQuery({})
  async getRoleList() {
    const list = await this.roleService.getList();
    return { list };
  }
}
