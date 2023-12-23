import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { OrganizationService } from '../../../service/organization.service';
import { GetOrganizationListDTO } from '../../../dto/areas/user/organization.dto';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/organization')
export class OrganizationController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['education'])
  @Get('/tree', { summary: '用户-查询组织树形列表' })
  @ApiQuery({})
  async getOrganizationTreeList(@Query() query: GetOrganizationListDTO) {
    const { list, count } = await this.organizationService.getTreeList(
      null,
      query.keyword
    );
    return { list, count };
  }
}
