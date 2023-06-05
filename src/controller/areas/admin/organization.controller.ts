import {
  Inject,
  Controller,
  Get,
  Post,
  Put,
  Del,
  Param,
  Body,
  Query,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { OrganizationService } from '../../../service/organization.service';
import {
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessMessage,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateOrganizationDTO,
  GetOrganizationListDTO,
  UpdateOrganizationDTO,
} from '../../../dto/areas/admin/organization.dto';
import { Organization } from '../../../entity/organization.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { TenantService } from '../../../service/tenant.service';

@ApiTags(['organization'])
@Controller('/api/admin/organization')
export class OrganizationController {
  @Inject()
  ctx: Context;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  tenantService: TenantService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个组织' })
  @ApiParam({ name: 'id', description: '编号' })
  async getOrganization(@Param('id') id: string) {
    const mdl = await this.organizationService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询组织列表' })
  @ApiQuery({})
  async getOrganizationList(@Query() query: GetOrganizationListDTO) {
    const result = await this.organizationService.getPaginatedList(
      query.currentPage,
      query.pageSize,
      {
        where: {
          ...(isEmpty(query.keyword)
            ? {}
            : { name: Like(`%${query.keyword}%`) }),
        },
      }
    );
    return ajaxListResult({ result });
  }

  @Get('/tree', { summary: '查询组织树形列表' })
  @ApiQuery({})
  async getOrganizationTreeList(@Query() query: GetOrganizationListDTO) {
    const list = await this.organizationService.getTreeList(query.keyword);
    return ajaxListResult({
      result: [list, list.length],
    });
  }

  @Post('/create', { summary: '新建组织' })
  @ApiBody({ description: '组织信息' })
  async createOrganization(@Body() dto: CreateOrganizationDTO) {
    if (await this.organizationService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', {
          group: 'organization',
        })
      );
    }
    if (
      !isEmpty(dto.parentId) &&
      !(await this.organizationService.exist({
        where: {
          id: dto.parentId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('parent_id.base.message', {
          group: 'organization',
        })
      );
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('tenant_id.base.message', {
          group: 'organization',
        })
      );
    }
    const mdl = await this.organizationService.createObject(<Organization>dto);
    return ajaxSuccessResult(omit(mdl, ['deletedDate']));
  }

  @Put('/:id', { summary: '修改组织' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '组织信息' })
  async updateOrganization(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDTO
  ) {
    const organization = await this.organizationService.getObjectById(id);
    if (!organization) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.organizationService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', {
          group: 'organization',
        })
      );
    }
    if (
      !isEmpty(dto.parentId) &&
      !(await this.organizationService.exist({
        where: {
          id: dto.parentId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('parent_id.base.message', {
          group: 'organization',
        })
      );
    }
    Object.assign(organization, dto);
    const mdl = await this.organizationService.updateObject(id, organization);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id', { summary: '删除组织' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteOrganization(@Param('id') id: string) {
    if (!(await this.organizationService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.organizationService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Del('/soft/:id', { summary: '软删除组织' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteOrganization(@Param('id') id: string) {
    if (!(await this.organizationService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.organizationService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Post('/restore/:id', { summary: '恢复软删除组织' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.organizationService.restoreDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('restore.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('restore.success', { group: 'global' })
    );
  }
}
