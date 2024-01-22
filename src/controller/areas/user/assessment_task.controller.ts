import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Del,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { AssessmentService } from '../../../service/assessment.service';
import {
  CreateAssessmentTaskDTO,
  GetAssessmentTaskListDTO,
  UpdateAssessmentTaskDTO,
} from '../../../dto/areas/user/assessment_task.dto';
import { isEmpty, omit } from 'lodash';
import { AssessmentTaskService } from '../../../service/assessment_task.service';
import { AssessmentTaskEntity } from '../../../entity/assessment_task.entity';
import { Like } from 'typeorm';
import { AssessmentTaskStatus } from '../../../constant';
import { AssessmentTaskDetailService } from '../../../service/assessment_task_detail.service';
import { CommonError } from '../../../error';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/assessment_task')
export class AssessmentTaskController extends BaseUserController {
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

  @Role(['admin', 'education'])
  @Get('/list', { summary: '用户-查询考核任务列表' })
  @ApiQuery({})
  async getAssessmentList(@Query() query: GetAssessmentTaskListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.assessmentTaskService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...(isEmpty(query.keyword)
              ? {}
              : { title: Like(`%${query.keyword}%`) }),
          },
          order: {
            updatedDate: 'DESC',
          },
        }
      );
    return {
      list,
      count,
      currentPage,
      pageSize,
    };
  }

  @Role(['education'])
  @Post('/create', { summary: '用户-新建考核任务' })
  @ApiBody({ description: '考核任务信息' })
  async createAssessmentTask(@Body() dto: CreateAssessmentTaskDTO) {
    if (await this.assessmentTaskService.checkTitleExisted(dto.title)) {
      throw new CommonError('task.title.exist.message', {
        group: 'assessment',
      });
    }
    const { list } = await this.assessmentService.getTreeList();
    const { currentUser } = this.ctx;
    const entity = <AssessmentTaskEntity>dto;
    entity.creatorUserId = currentUser.id;
    entity.content = { list };

    const mdl = await this.assessmentTaskService.createObject(entity);
    if (mdl.status === AssessmentTaskStatus.Official) {
      // 发布考核任务
      await this.assessmentTaskDetailService.publicTask(mdl);
    }

    return omit(mdl, [
      'createdDate',
      'deletedDate',
      'updatedDate',
      'creatorUserId',
    ]);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改考核任务' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '考核任务信息' })
  async updateAssessmentTask(
    @Param('id') id: string,
    @Body() dto: UpdateAssessmentTaskDTO
  ) {
    const mdl = await this.assessmentTaskService.getOneObject({
      where: {
        id,
        status: AssessmentTaskStatus.Draft,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    Object.assign(mdl, dto);
    const { list } = await this.assessmentService.getTreeList();
    mdl.content = { list };

    await this.assessmentTaskService.updateObject(mdl);

    if (mdl.status === AssessmentTaskStatus.Official) {
      // 发布考核任务
      await this.assessmentTaskDetailService.publicTask(mdl);
    }

    return omit(mdl, [
      'createdDate',
      'deletedDate',
      'updatedDate',
      'creatorUserId',
    ]);
  }

  @Role(['education'])
  @Get('/statistic/:id', { summary: '用户-获取考核任务统计' })
  @ApiParam({ name: 'id', description: '编号' })
  async getAssessmentTaskStatistic(@Param('id') id: string) {
    if (
      !(await this.assessmentTaskService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return await this.assessmentTaskDetailService.getStatistic(id);
  }

  @Role(['education'])
  @Get('/details/:id', { summary: '用户-获取考核任务明细' })
  @ApiParam({ name: 'id', description: '编号' })
  async getAssessmentTaskDetailList(@Param('id') id: string) {
    if (
      !(await this.assessmentTaskService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const list = await this.assessmentTaskDetailService.getList({
      where: {
        assessmentTaskId: id,
      },
      relations: ['receiveSchoolOrganization', 'submitUser'],
    });
    return {
      list: list.map(item => ({
        ...omit(item, [
          'updatedDate',
          'receiveSchoolOrganization',
          'submitUser',
        ]),
        ...(item.receiveSchoolOrganization && {
          receiveSchoolOrganization: {
            name: item.receiveSchoolOrganization.name,
          },
        }),
        ...(item.submitUser && {
          submitUser: {
            name: item.submitUser.name,
          },
        }),
      })),
      count: list.length,
    };
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除考核任务' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteAssessmentTask(@Param('id') id: string) {
    if (
      !(await this.assessmentTaskService.existObject({
        where: {
          id,
          status: AssessmentTaskStatus.Draft,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.assessmentTaskService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
