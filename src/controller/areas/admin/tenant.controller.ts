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
import { TenantService } from '../../../service/tenant.service';
import {
  CreateTenantDTO,
  GetTenantListDTO,
  UpdateTenantDTO,
} from '../../../dto/areas/admin/tenant.dto';
import { Tenant } from '../../../entity/tenant.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
// import { Validate } from '@midwayjs/validate';

@ApiTags(['tenant'])
@Controller('/api/admin/tenant')
export class TenantController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  tenantService: TenantService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个租户' })
  @ApiParam({ name: 'id', description: '编号' })
  async getTenant(@Param('id') id: string) {
    const mdl = await this.tenantService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Get('/list', { summary: '查询租户列表' })
  @ApiQuery({})
  async getTenantList(@Query() query: GetTenantListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.tenantService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...(isEmpty(query.keyword)
              ? {}
              : {
                  name: Like(`%${query.keyword}%`),
                }),
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

  // @Validate({
  //   errorStatus: 422,
  // })
  @Post('/create', { summary: '新建租户' })
  @ApiBody({ description: '租户信息' })
  async createTenant(@Body() dto: CreateTenantDTO) {
    if (await this.tenantService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'tenant' });
    }
    const mdl = await this.tenantService.createObject(<Tenant>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Put('/:id', { summary: '修改租户' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '租户信息' })
  async updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDTO) {
    const tenant = await this.tenantService.getObjectById(id);
    if (!tenant) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.tenantService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'tenant' });
    }
    Object.assign(tenant, dto);
    const mdl = await this.tenantService.updateObject(tenant);
    return omit(mdl, ['deletedDate']);
  }

  @Del('/:id', { summary: '删除租户' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteTenant(@Param('id') id: string) {
    if (!(await this.tenantService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.tenantService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Del('/soft/:id', { summary: '软删除租户' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteTenant(@Param('id') id: string) {
    if (!(await this.tenantService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.tenantService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Post('/restore/:id', { summary: '恢复软删除租户' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.tenantService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
