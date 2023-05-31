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
  GetTenantListDTO,
  UpdateTenantDTO,
} from '../../../dto/areas/admin/tenant.dto';
import { Tenant } from '../../../entity/tenant.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
// import { Validate } from '@midwayjs/validate';

@Controller('/api/admin/tenant')
export class TenantController {
  @Inject()
  ctx: Context;

  @Inject()
  tenantService: TenantService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id')
  async getTenant(@Param('id') id: string) {
    const mdl = await this.tenantService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list')
  async getTenantList(@Query() query: GetTenantListDTO) {
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
    const mdl = await this.tenantService.createObject(<Tenant>dto);
    return ajaxSuccessResult(mdl);
  }

  @Put('/:id')
  async updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDTO) {
    const mdl = await this.tenantService.updateObject(id, <Tenant>dto);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id')
  async deleteTenant(@Param('id') id: string) {
    if (!(await this.tenantService.existObjectById(id))) {
      return ajaxErrorResult(this.i18nService.translate('not.exist'));
    }
    const result = await this.tenantService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorResult(this.i18nService.translate('delete.failure'));
    }
    return ajaxSuccessResult();
  }

  @Del('/soft/:id')
  async softDeleteTenant(@Param('id') id: string) {
    if (!(await this.tenantService.existObjectById(id))) {
      return ajaxErrorResult(this.i18nService.translate('not.exist'));
    }
    const result = await this.tenantService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorResult(this.i18nService.translate('delete.failure'));
    }
    return ajaxSuccessResult();
  }
}
