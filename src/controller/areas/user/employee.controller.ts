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
} from '../../../dto/areas/user/employee.dto';
import { EmployeeEntity } from '../../../entity/employee.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { TenantService } from '../../../service/tenant.service';
import { OrganizationService } from '../../../service/organization.service';
import { BaseUserController } from './base/base.user.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';

@ApiTags(['employee'])
@Controller('/api/user/employee')
export class EmployeeController extends BaseUserController {
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

  @Role(['school', 'security'])
  @Get('/:id', { summary: '用户-查询单个员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async getEmployee(@Param('id') id: string) {
    const tenantId = this.ctx.currentUser.tenantId;
    const mdl = await this.employeeService.getOneObject({
      where: {
        id,
        tenantId,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['school', 'security'])
  @Get('/list', { summary: '用户-查询员工列表' })
  @ApiQuery({})
  async getEmployeeList(@Query() query: GetEmployeeListDTO) {
    const tenantId = this.ctx.currentUser.tenantId;
    const [list, count, currentPage, pageSize] =
      await this.employeeService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            tenantId,
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

  @Role(['school', 'security'])
  @Post('/create', { summary: '用户-新建员工' })
  @ApiBody({ description: '员工信息' })
  async createEmployee(@Body() dto: CreateEmployeeDTO) {
    const tenantId = this.ctx.currentUser.tenantId;
    if (await this.employeeService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'employee' });
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
          tenantId,
        },
      }))
    ) {
      throw new CommonError('organization_id.base.message', {
        group: 'employee',
      });
    }
    (<EmployeeEntity>dto).tenantId = tenantId;
    const mdl = await this.employeeService.createObject(<EmployeeEntity>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['school', 'security'])
  @Put('/:id', { summary: '用户-修改员工' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '员工信息' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDTO
  ) {
    const tenantId = this.ctx.currentUser.tenantId;
    const mdl = await this.employeeService.getOneObject({
      where: {
        id,
        tenantId,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
          tenantId,
        },
      }))
    ) {
      throw new CommonError('organization_id.base.message', {
        group: 'employee',
      });
    }
    Object.assign(mdl, dto);
    mdl.tenantId = tenantId;
    return omit(await this.employeeService.updateObject(mdl), ['deletedDate']);
  }

  @Role(['school', 'security'])
  @Del('/:id', { summary: '用户-删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteEmployee(@Param('id') id: string) {
    if (
      !(await this.employeeService.existObject({
        where: {
          id,
          tenantId: this.ctx.currentUser.tenantId,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.employeeService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['school', 'security'])
  @Del('/soft/:id', { summary: '用户-软删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteEmployee(@Param('id') id: string) {
    if (
      !(await this.employeeService.existObject({
        where: {
          id,
          tenantId: this.ctx.currentUser.tenantId,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.employeeService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
