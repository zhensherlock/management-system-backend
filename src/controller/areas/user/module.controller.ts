import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { ModuleService } from '../../../service/module.service';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/module')
export class ModuleController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  moduleService: ModuleService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security'])
  @Get('/list', { summary: '用户-查询可用模块列表' })
  @ApiQuery({})
  async getModuleList() {
    const user = this.ctx.currentUser;
    const moduleRoleMappings = user.userRoleMappings.map(item => ({
      roleId: item.roleId,
    }));
    const modules = await this.moduleService.getList({
      relations: ['operations'],
      where: {
        moduleRoleMappings,
      },
    });
    return {
      modules,
    };
  }
}
