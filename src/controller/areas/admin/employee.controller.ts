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
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessMessage,
  ajaxSuccessResult,
} from '../../../util';
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

@ApiTags(['employee'])
@Controller('/api/admin/employee')
export class EmployeeController {
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
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询员工列表' })
  @ApiQuery({})
  async getEmployeeList(@Query() query: GetEmployeeListDTO) {
    const result = await this.employeeService.getPaginatedList(
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
    return ajaxListResult({ result });
  }

  @Post('/create', { summary: '新建员工' })
  @ApiBody({ description: '员工信息' })
  async createEmployee(@Body() dto: CreateEmployeeDTO) {
    if (await this.employeeService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', {
          group: 'employee',
        })
      );
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('organization_id.base.message', {
          group: 'employee',
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
          group: 'employee',
        })
      );
    }
    const mdl = await this.employeeService.createObject(<Employee>dto);
    return ajaxSuccessResult(omit(mdl, ['deletedDate']));
  }

  @Put('/:id', { summary: '修改员工' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '员工信息' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDTO
  ) {
    const employee = await this.employeeService.getObjectById(id);
    if (!employee) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.employeeService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', {
          group: 'employee',
        })
      );
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('organization_id.base.message', {
          group: 'employee',
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
          group: 'employee',
        })
      );
    }
    Object.assign(employee, dto);
    const mdl = await this.employeeService.updateObject(id, employee);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id', { summary: '删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteEmployee(@Param('id') id: string) {
    if (!(await this.employeeService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.employeeService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Del('/soft/:id', { summary: '软删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteEmployee(@Param('id') id: string) {
    if (!(await this.employeeService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.employeeService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Post('/restore/:id', { summary: '恢复软删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.employeeService.restoreDeleteObject(id);
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
