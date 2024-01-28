import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { OrganizationService } from '../../../service/organization.service';
import { GetAssessmentTaskStatisticDTO } from '../../../dto/areas/user/statistic.dto';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/statistic')
export class StatisticController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin', 'education'])
  @Get('/assessment', { summary: '统计' })
  @ApiQuery({})
  async getOrganizationTreeList(@Query() query: GetAssessmentTaskStatisticDTO) {
    return {};
  }
}
