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
  File,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { EmployeeService } from '../../../service/employee.service';
import {
  CreateEmployeeDTO,
  GetEmployeeListDTO,
  UpdateEmployeeDTO,
} from '../../../dto/areas/user/employee.dto';
import { EmployeeEntity } from '../../../entity/employee.entity';
import { In, Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
  BodyContentType,
} from '@midwayjs/swagger';
import { isArray, isEmpty, isString, omit } from 'lodash';
import { TenantService } from '../../../service/tenant.service';
import { OrganizationService } from '../../../service/organization.service';
import { BaseUserController } from './base/base.user.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';
import { CompanyService } from '../../../service/company.service';

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
  companyService: CompanyService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/:id', { summary: '用户-查询单个员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async getEmployee(@Param('id') id: string) {
    const mdl = await this.employeeService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询员工列表' })
  @ApiQuery({})
  async getEmployeeList(@Query() query: GetEmployeeListDTO) {
    let companyWhere = {};
    if (isString(query.companyIds)) {
      companyWhere = { companyId: query.companyIds };
    }
    if (isArray(query.companyIds)) {
      companyWhere = { companyId: In(query.companyIds) };
    }
    const [list, count, currentPage, pageSize] =
      await this.employeeService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...companyWhere,
            ...(isEmpty(query.organizationIds)
              ? {}
              : { organizationId: In(query.organizationIds) }),
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
  @Post('/import', { summary: '用户-导入员工' })
  @ApiBody({
    description: '用户数据文件',
    contentType: BodyContentType.Multipart,
  })
  async importUsers(@File() file) {
    await this.employeeService.importEmployeeList(file.data);
    return this.i18nService.translate('import.success', { group: 'global' });
  }

  @Role(['school', 'security', 'education'])
  @Post('/create', { summary: '用户-新建员工' })
  @ApiBody({ description: '员工信息' })
  async createEmployee(@Body() dto: CreateEmployeeDTO) {
    if (await this.employeeService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'employee' });
    }
    if (
      !(await this.companyService.exist({
        where: {
          id: dto.companyId,
        },
      }))
    ) {
      throw new CommonError('company_id.base.message', {
        group: 'employee',
      });
    }
    if (
      !isEmpty(dto.organizationId) &&
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
    const mdl = await this.employeeService.createObject(<EmployeeEntity>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['school', 'security', 'education'])
  @Put('/:id', { summary: '用户-修改员工' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '员工信息' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDTO
  ) {
    const mdl = await this.employeeService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (
      !(await this.companyService.exist({
        where: {
          id: dto.companyId,
        },
      }))
    ) {
      throw new CommonError('company_id.base.message', {
        group: 'employee',
      });
    }
    if (
      !isEmpty(dto.organizationId) &&
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
    Object.assign(mdl, dto);
    return omit(await this.employeeService.updateObject(mdl), ['deletedDate']);
  }

  @Role(['school', 'security', 'education'])
  @Del('/:id', { summary: '用户-删除员工' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteEmployee(@Param('id') id: string) {
    if (
      !(await this.employeeService.existObject({
        where: {
          id,
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
}
