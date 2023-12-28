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
  CreateAssessmentDTO,
  GetAssessmentListDTO,
  UpdateAssessmentDTO,
} from '../../../dto/areas/user/assessment.dto';
import { isEmpty, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';
import { AssessmentEntity } from '../../../entity/assessment.entity';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/assessment')
export class AssessmentController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  assessmentService: AssessmentService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询考核类型列表' })
  @ApiQuery({})
  async getAssessmentList(@Query() query: GetAssessmentListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.assessmentService.getPaginatedList(
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

  @Role(['school', 'security', 'education'])
  @Get('/tree', { summary: '用户-查询考核树形列表' })
  @ApiQuery({})
  async getAssessmentTreeList(@Query() query: GetAssessmentListDTO) {
    const { list, count } = await this.assessmentService.getTreeList(
      query.keyword
    );
    return { list, count };
  }

  @Role(['education'])
  @Post('/create', { summary: '用户-新建考核类型' })
  @ApiBody({ description: '考核类型信息' })
  async createAssessment(@Body() dto: CreateAssessmentDTO) {
    if (await this.assessmentService.checkTitleExisted(dto.title)) {
      throw new CommonError('title.exist.message', {
        group: 'assessment',
      });
    }
    const assessment = <AssessmentEntity>dto;
    assessment.enabled = true;
    if (dto.parentId) {
      const parentAssessment = await this.assessmentService.getOneObject({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentAssessment) {
        throw new CommonError('parent_id.base.message', {
          group: 'assessment',
        });
      }
      assessment.level = parentAssessment.level + 1;
    } else {
      assessment.level = 1;
    }
    const mdl = await this.assessmentService.createObject(
      <AssessmentEntity>dto
    );
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改考核类型' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '考核类型信息' })
  async updateAssessment(
    @Param('id') id: string,
    @Body() dto: UpdateAssessmentDTO
  ) {
    const mdl = await this.assessmentService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.assessmentService.checkTitleExisted(dto.title, id)) {
      throw new CommonError('title.exist.message', {
        group: 'assessment',
      });
    }
    if (dto.parentId) {
      const parentAssessment = await this.assessmentService.getOneObject({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentAssessment) {
        throw new CommonError('parent_id.base.message', {
          group: 'assessment',
        });
      }
      mdl.level = parentAssessment.level + 1;
    } else {
      mdl.level = 1;
    }
    Object.assign(mdl, dto);

    return omit(await this.assessmentService.updateObject(mdl), [
      'deletedDate',
    ]);
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除考核类型' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteAssessment(@Param('id') id: string) {
    if (
      !(await this.assessmentService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.assessmentService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
