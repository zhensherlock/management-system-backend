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
  ajaxErrorResult,
  ajaxListResult,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateTenantDTO,
  UpdateTenantDTO,
} from '../../../dto/areas/admin/tenant.dto';
import { Tenant } from '../../../entity/tenant.entity';
import { IGetTenantListOptions } from '../../../interface';
import { Like } from 'typeorm';
// import { Validate } from '@midwayjs/validate';

@Controller('/api/admin/tenant')
export class TenantController {
  @Inject()
  ctx: Context;

  @Inject()
  tenantService: TenantService;

  @Get('/:id')
  async getTenant(@Param('id') id: string) {
    const tenant = await this.tenantService.getObjectById(id);
    return ajaxSuccessResult(tenant);
  }

  @Get('/list')
  async getTenantList(@Query() query: IGetTenantListOptions) {
    const result = await this.tenantService.getPaginatedList(
      query.currentPage,
      query.pageSize,
      {
        where: {
          name: Like(`%${query.keyword}%`),
        },
      }
    );
    return ajaxListResult({ result });
  }

  @Post('/create')
  // @Validate({
  //   errorStatus: 422,
  // })
  async createTenant(@Body() dto: CreateTenantDTO) {
    const tenant = await this.tenantService.createObject(<Tenant>dto);
    return ajaxSuccessResult(tenant);
  }

  @Put('/:id')
  async updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDTO) {
    const tenant = await this.tenantService.updateObject(id, <Tenant>dto);
    return ajaxSuccessResult(tenant);
  }

  @Del('/:id')
  async deleteTenant(@Param('id') id: string) {
    const result = await this.tenantService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorResult('id不正确');
    }
    return ajaxSuccessResult();
  }

  @Del('/soft/:id')
  async softDeleteTenant(@Param('id') id: string) {
    const result = await this.tenantService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorResult('id不正确');
    }
    return ajaxSuccessResult();
  }
}
