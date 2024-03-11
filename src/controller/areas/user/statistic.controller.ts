import { Controller, Get, Inject, Param, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { AssessmentTaskService } from '../../../service/assessment_task.service';
import { AssessmentTaskDetailService } from '../../../service/assessment_task_detail.service';
import { CommonError } from '../../../error';
import { OrganizationService } from '../../../service/organization.service';
import { OrganizationType } from '../../../constant';
import { GetStatisticBySchoolIdsDTO } from '../../../dto/areas/user/statistic.dto';
import { In } from 'typeorm';
import { isString, omit } from 'lodash';

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
        select: ['status'],
      });
    return assessmentTaskStatistic.statistic;
  }

  @Role(['admin', 'education'])
  @Get('/school/:id', {
    summary: '获取某个学校考核统计数据',
  })
  @ApiParam({ name: 'id', description: '学校编号' })
  async getStatisticBySchoolId(@Param('id') schoolId: string) {
    if (!(await this.organizationService.existSchoolById(schoolId))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return await this.assessmentTaskDetailService.getStatistic({
      where: {
        receiveSchoolOrganizationId: schoolId,
      },
      select: ['status'],
      order: {
        submitDate: 'DESC',
      },
    });
  }

  @Role(['admin', 'education'])
  @Get('/schools', {
    summary: '获取某些学校考核统计数据',
  })
  @ApiQuery({})
  async getStatisticBySchoolIds(@Query() query: GetStatisticBySchoolIdsDTO) {
    const list = await this.assessmentTaskDetailService.getList({
      where: {
        receiveSchoolOrganizationId: isString(query.schoolIds)
          ? query.schoolIds
          : In(query.schoolIds),
        assessmentTaskId: isString(query.assessmentTaskIds)
          ? query.assessmentTaskIds
          : In(query.assessmentTaskIds),
      },
      order: {
        assessmentTask: {
          endDate: 'DESC',
          startDate: 'DESC',
          updatedDate: 'DESC',
        },
        // submitDate: 'DESC',
      },
      relations: ['assessmentTask', 'receiveSchoolOrganization'],
    });
    return {
      list: list.map(item => ({
        ...omit(item, [
          'createdDate',
          'updatedDate',
          'creatorUserId',
          'assessmentTask',
          'assessmentContent',
          'receiveSchoolOrganization',
          'scoreContent',
        ]),
        assessmentTaskTitle: item.assessmentTask.title,
        schoolName: item.receiveSchoolOrganization.name,
      })),
    };
  }

  @Role(['admin', 'education'])
  @Get('/school/list', { summary: '获取学校列表' })
  async getSchoolTreeList() {
    const { list, count } = await this.organizationService.getTreeList(
      OrganizationType.School,
      '',
      2
    );
    return { list, count };
  }
}
