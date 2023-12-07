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
  File,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
  BodyContentType,
} from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { OrganizationService } from '../../../service/organization.service';
import {
  CreateSchoolDTO,
  GetSchoolListDTO,
  UpdateSchoolDTO,
} from '../../../dto/areas/user/school.dto';
import { isEmpty, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';
import { OrganizationEntity } from '../../../entity/organization.entity';
import { OrganizationType } from '../../../constant';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/school')
export class SchoolController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询学校列表' })
  @ApiQuery({})
  async getSchoolList(@Query() query: GetSchoolListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.organizationService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            type: OrganizationType.School,
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
  @Post('/import', { summary: '用户-导入学校列表' })
  @ApiBody({
    description: '用户数据文件',
    contentType: BodyContentType.Multipart,
  })
  async importUsers(@File() file) {
    // await this.organizationService.importList(file.data);
    return this.i18nService.translate('import.success', { group: 'global' });
  }

  @Role(['education'])
  @Post('/create', { summary: '用户-新建学校' })
  @ApiBody({ description: '学校信息' })
  async create(@Body() dto: CreateSchoolDTO) {
    if (await this.organizationService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'school' });
    }
    const school = <OrganizationEntity>dto;
    school.enabled = true;
    const mdl = await this.organizationService.createObject(
      <OrganizationEntity>dto
    );
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改学校' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '学校信息' })
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolDTO) {
    const mdl = await this.organizationService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.organizationService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'school' });
    }

    Object.assign(mdl, dto);

    return omit(await this.organizationService.updateObject(mdl), [
      'deletedDate',
    ]);
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除学校公司' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteSchool(@Param('id') id: string) {
    if (
      !(await this.organizationService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.organizationService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
