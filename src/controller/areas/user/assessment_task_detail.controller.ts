import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { AssessmentService } from '../../../service/assessment.service';
import { isEmpty, omit } from 'lodash';
import { AssessmentTaskService } from '../../../service/assessment_task.service';
import { FindOptionsWhere, Like } from 'typeorm';
import { AssessmentTaskDetailService } from '../../../service/assessment_task_detail.service';
import {
  GetAssessmentTaskDetailListDTO,
  EvaluationScoreDTO,
} from '../../../dto/areas/user/assessment_task_detail.dto';
import { AssessmentTaskDetailEntity } from '../../../entity/assessment_task_detail.entity';
import { CommonError } from '../../../error';
import {
  AssessmentTaskDetailStatus,
  AssessmentTaskStatus,
} from '../../../constant';
import { AssessmentTaskDetailScoreContentType } from '../../../types';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/assessment_task_detail')
export class AssessmentTaskDetailController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  assessmentService: AssessmentService;

  @Inject()
  assessmentTaskService: AssessmentTaskService;

  @Inject()
  assessmentTaskDetailService: AssessmentTaskDetailService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school'])
  @Get('/list/my', { summary: '学校用户-获取关于我的考核任务' })
  async getMyAssessmentTaskList(
    @Query() query: GetAssessmentTaskDetailListDTO
  ) {
    const { currentUser } = this.ctx;
    const where: FindOptionsWhere<AssessmentTaskDetailEntity> = {
      receiveSchoolOrganizationId: currentUser.organizations[0]?.id,
      ...(!isEmpty(query.keyword) && {
        assessmentTask: { title: Like(`%${query.keyword}%`) },
      }),
      ...(!isEmpty(query.status) && {
        status: Like(`${query.status}%`),
      }),
    };
    const [list, count, currentPage, pageSize] =
      await this.assessmentTaskDetailService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where,
          order: {
            createdDate: 'DESC',
          },
          relations: ['assessmentTask'],
        }
      );
    return {
      list: list.map(item => ({
        ...omit(item, [
          'created_date',
          'updated_date',
          'receive_school_organization_id',
          'submit_user_id',
          'creator_user_id',
          'assessmentTask',
          'assessmentContent',
        ]),
        assessmentTask: {
          title: item.assessmentTask.title,
          description: item.assessmentTask.description,
          startDate: item.assessmentTask.startDate,
          endDate: item.assessmentTask.endDate,
          basicScore: item.assessmentTask.basicScore,
          content: item.assessmentTask.content,
        },
      })),
      count,
      currentPage,
      pageSize,
    };
  }

  @Role(['school'])
  @Post('/evaluation/:id', { summary: '学校用户-进行考核评分' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '考核评分信息' })
  async EvaluationScore(
    @Param('id') id: string,
    @Body() dto: EvaluationScoreDTO
  ) {
    const mdl = await this.assessmentTaskDetailService.getObjectById(id, {
      relations: ['assessmentTask'],
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (
      mdl.assessmentTask.status !== AssessmentTaskStatus.Official ||
      ![
        AssessmentTaskDetailStatus.Pending,
        AssessmentTaskDetailStatus.Returned,
      ].includes(mdl.status as AssessmentTaskDetailStatus)
    ) {
      throw new CommonError('detail.not.allowed.evaluate', {
        group: 'assessment',
      });
    }
    if (dto.isDraft) {
      mdl.scoreContent = dto.scoreContent;
    } else {
      this.assessmentTaskDetailService.evaluationScore(
        mdl,
        this.ctx.currentUser.id,
        dto.scoreContent as AssessmentTaskDetailScoreContentType
      );
    }
    await this.assessmentTaskDetailService.updateObject(mdl);
    return this.i18nService.translate('success.msg', { group: 'global' });
  }
}
