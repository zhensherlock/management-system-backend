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
import { OrganizationService } from '../../../service/organization.service';
import {
  CreateCompanyDTO,
  GetCompanyListDTO,
  UpdateCompanyDTO,
} from '../../../dto/areas/user/company.dto';
import { isEmpty, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';
import { OrganizationEntity } from '../../../entity/organization.entity';
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
    const tenantId = this.ctx.currentUser.tenantId;
    const [list, count, currentPage, pageSize] =
      await this.organizationService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            tenantId,
            type: OrganizationType.Company,
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
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
  @Post('/create', { summary: '用户-新建保安公司' })
  @ApiBody({ description: '保安公司信息' })
  async createCompany(@Body() dto: CreateCompanyDTO) {
    const tenantId = this.ctx.currentUser.tenantId;
    if (await this.organizationService.checkNameExisted(dto.name, tenantId)) {
      throw new CommonError('name.exist.message', { group: 'organization' });
    }
    const company = <OrganizationEntity>dto;
    company.tenantId = tenantId;
    company.type = OrganizationType.Company;
    company.enabled = true;
    const mdl = await this.organizationService.createObject(
      <OrganizationEntity>dto
    );
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改保安公司' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '保安公司信息' })
  async updateCompany(@Param('id') id: string, @Body() dto: UpdateCompanyDTO) {
    const tenantId = this.ctx.currentUser.tenantId;
    const mdl = await this.organizationService.getOneObject({
      where: {
        id,
        type: OrganizationType.Company,
        tenantId,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (
      await this.organizationService.checkNameExisted(dto.name, tenantId, id)
    ) {
      throw new CommonError('name.exist.message', { group: 'organization' });
    }

    Object.assign(mdl, dto);
    mdl.tenantId = tenantId;

    return omit(await this.organizationService.updateObject(mdl), [
      'deletedDate',
    ]);
  }

  @Role(['education'])
  @Del('/soft/:id', { summary: '用户-软删除保安公司' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteEmployee(@Param('id') id: string) {
    if (
      !(await this.organizationService.existObject({
        where: {
          id,
          type: OrganizationType.Company,
          tenantId: this.ctx.currentUser.tenantId,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.organizationService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
