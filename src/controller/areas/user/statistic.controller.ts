import { Controller, Get, Inject, Param, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { GetAssessmentTaskStatisticDTO } from '../../../dto/areas/user/statistic.dto';
import { AssessmentTaskService } from '../../../service/assessment_task.service';
import { AssessmentTaskDetailService } from '../../../service/assessment_task_detail.service';
import { CommonError } from '../../../error';
import { OrganizationService } from '../../../service/organization.service';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/statistic')
export class StatisticController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  assessmentTaskService: AssessmentTaskService;

  @Inject()
  assessmentTaskDetailService: AssessmentTaskDetailService;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin', 'education'])
  @Get('/assessment/summary', { summary: '全部考核任务统计汇总数据' })
  async getAssessmentTaskSummaryStatistic() {
    return await this.assessmentTaskService.getAssessmentTaskSummaryStatistic();
  }

  @Role(['admin', 'education'])
  @Get('/assessment/publishedTaskGroupList', {
    summary: '获取已发布的考核任务列表',
  })
  async getPublishedGroupList() {
    return await this.assessmentTaskService.getAssessmentTaskPublishedGroupList();
  }

  @Role(['admin', 'education'])
  @Get('/assessment/:id', {
    summary: '获取某个考核任务统计数据',
  })
  @ApiParam({ name: 'id', description: '考核任务编号' })
  async getAssessmentTaskDetailStatistic(@Param('id') id: string) {
    if (!(await this.assessmentTaskService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const assessmentTaskStatistic =
      await this.assessmentTaskDetailService.getStatistic({
        where: {
          assessmentTaskId: id,
        },
      });
    return assessmentTaskStatistic.statistic;
  }

  @Role(['admin', 'education'])
  @Get('/assessment/school/:id', {
    summary: '获取某个学校考核统计数据',
  })
  @ApiParam({ name: 'id', description: '考核任务编号' })
  async getStatisticBySchoolId(@Param('id') schoolId: string) {
    if (!(await this.organizationService.existSchoolById(schoolId))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return await this.assessmentTaskDetailService.getStatistic({
      where: {
        receiveSchoolOrganizationId: schoolId,
      },
      order: {
        submitDate: 'DESC',
      },
    });
  }

  @Role(['admin', 'education'])
  @Get('/assessment', { summary: '统计' })
  @ApiQuery({})
  async getOrganizationTreeList(@Query() query: GetAssessmentTaskStatisticDTO) {
    return {};
  }
}
