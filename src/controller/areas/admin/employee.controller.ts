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
import { EmployeeService } from '../../../service/employee.service';
import {
  CreateEmployeeDTO,
  GetEmployeeListDTO,
  UpdateEmployeeDTO,
} from '../../../dto/areas/admin/employee.dto';
import { Employee } from '../../../entity/employee.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { TenantService } from '../../../service/tenant.service';
import { OrganizationService } from '../../../service/organization.service';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';

@ApiTags(['employee'])
@Controller('/api/admin/employee')
export class EmployeeController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  employeeService: EmployeeService;

  @Inject()
  tenantService: TenantService;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async getEmployee(@Param('id') id: string) {
    const mdl = await this.employeeService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Get('/list', { summary: '查询员工列表' })
  @ApiQuery({})
  async getEmployeeList(@Query() query: GetEmployeeListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.employeeService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            tenantId: query.tenantId,
            ...(isEmpty(query.organizationId)
              ? {}
              : { organizationId: query.organizationId }),
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

  @Post('/create', { summary: '新建员工' })
  @ApiBody({ description: '员工信息' })
  async createEmployee(@Body() dto: CreateEmployeeDTO) {
    if (await this.employeeService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'employee' });
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      throw new CommonError('organization_id.base.message', {
        group: 'employee',
      });
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      throw new CommonError('tenant_id.base.message', { group: 'employee' });
    }
    const mdl = await this.employeeService.createObject(<Employee>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Put('/:id', { summary: '修改员工' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '员工信息' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDTO
  ) {
    const mdl = await this.employeeService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.employeeService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'employee' });
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      throw new CommonError('organization_id.base.message', {
        group: 'employee',
      });
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      throw new CommonError('tenant_id.base.message', {
        group: 'employee',
      });
    }
    Object.assign(mdl, dto);
    return omit(await this.employeeService.updateObject(mdl), ['deletedDate']);
  }

  @Del('/:id', { summary: '删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteEmployee(@Param('id') id: string) {
    if (!(await this.employeeService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.employeeService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Del('/soft/:id', { summary: '软删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteEmployee(@Param('id') id: string) {
    if (!(await this.employeeService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.employeeService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Post('/restore/:id', { summary: '恢复软删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.employeeService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
