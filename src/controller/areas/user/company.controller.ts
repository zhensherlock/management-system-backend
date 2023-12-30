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
import {
  CreateCompanyDTO,
  GetCompanyListDTO,
  UpdateCompanyDTO,
} from '../../../dto/areas/user/company.dto';
import { isEmpty, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';
import { OrganizationEntity } from '../../../entity/organization.entity';
import { OrganizationService } from '../../../service/organization.service';
import { OrganizationType } from '../../../constant';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/company')
export class CompanyController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询保安公司列表' })
  @ApiQuery({})
  async getCompanyList(@Query() query: GetCompanyListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.organizationService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            type: OrganizationType.Company,
            level: 2,
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
          },
          order: {
            sequence: 'ASC',
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
  @Post('/import', { summary: '用户-导入保安公司列表' })
  @ApiBody({
    description: '用户数据文件',
    contentType: BodyContentType.Multipart,
  })
  async import(@File() file) {
    await this.organizationService.importCompanyList(file.data);
    return this.i18nService.translate('import.success', { group: 'global' });
  }

  @Role(['education'])
  @Post('/create', { summary: '用户-新建保安公司' })
  @ApiBody({ description: '保安公司信息' })
  async createCompany(@Body() dto: CreateCompanyDTO) {
    if (await this.organizationService.checkCompanyNameExisted(dto.name)) {
      throw new CommonError('company.name.exist.message', {
        group: 'organization',
      });
    }
    const parentCompany = await this.organizationService.getOneObject({
      where: {
        type: OrganizationType.Company,
        level: 1,
      },
    });
    const organization = <OrganizationEntity>dto;
    organization.type = OrganizationType.Company;
    organization.enabled = true;
    organization.parentId = parentCompany.id;
    organization.level = parentCompany.level + 1;
    const mdl = await this.organizationService.createObject(organization);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改保安公司' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '保安公司信息' })
  async updateCompany(@Param('id') id: string, @Body() dto: UpdateCompanyDTO) {
    const mdl = await this.organizationService.getOneObject({
      where: {
        id,
        type: OrganizationType.Company,
        level: 2,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.organizationService.checkCompanyNameExisted(dto.name, id)) {
      throw new CommonError('company.name.exist.message', {
        group: 'organization',
      });
    }

    Object.assign(mdl, dto);

    return omit(await this.organizationService.updateObject(mdl), [
      'deletedDate',
    ]);
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除保安公司' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteCompany(@Param('id') id: string) {
    if (
      !(await this.organizationService.existObject({
        where: {
          id,
          type: OrganizationType.Company,
          level: 2,
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
