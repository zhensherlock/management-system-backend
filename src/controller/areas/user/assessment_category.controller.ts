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
import { AssessmentCategoryService } from '../../../service/assessment_category.service';
import {
  CreateAssessmentCategoryDTO,
  GetAssessmentCategoryListDTO,
  UpdateAssessmentCategoryDTO,
} from '../../../dto/areas/user/assessment_category.dto';
import { isEmpty, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';
import { AssessmentCategoryEntity } from '../../../entity/assessment_category.entity';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/assessment_category')
export class AssessmentCategoryController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  assessment_categoryService: AssessmentCategoryService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询考核类型列表' })
  @ApiQuery({})
  async getAssessmentCategoryList(
    @Query() query: GetAssessmentCategoryListDTO
  ) {
    const [list, count, currentPage, pageSize] =
      await this.assessment_categoryService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
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
  @Post('/create', { summary: '用户-新建考核类型' })
  @ApiBody({ description: '考核类型信息' })
  async createAssessmentCategory(@Body() dto: CreateAssessmentCategoryDTO) {
    if (await this.assessment_categoryService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', {
        group: 'assessment_category',
      });
    }
    const assessment_category = <AssessmentCategoryEntity>dto;
    assessment_category.enabled = true;
    const mdl = await this.assessment_categoryService.createObject(
      <AssessmentCategoryEntity>dto
    );
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改考核类型' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '考核类型信息' })
  async updateAssessmentCategory(
    @Param('id') id: string,
    @Body() dto: UpdateAssessmentCategoryDTO
  ) {
    const mdl = await this.assessment_categoryService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.assessment_categoryService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', {
        group: 'assessment_category',
      });
    }

    Object.assign(mdl, dto);

    return omit(await this.assessment_categoryService.updateObject(mdl), [
      'deletedDate',
    ]);
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除考核类型' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteAssessmentCategory(@Param('id') id: string) {
    if (
      !(await this.assessment_categoryService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.assessment_categoryService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
