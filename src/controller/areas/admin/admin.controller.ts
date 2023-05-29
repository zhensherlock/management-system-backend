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
import { AdminService } from '../../../service/admin.service';
import {
  ajaxErrorResult,
  ajaxListResult,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateAdminDTO,
  UpdateAdminDTO,
} from '../../../dto/areas/admin/admin.dto';
import { Admin } from '../../../entity/admin.entity';
import { IGetAdminListOptions } from '../../../interface';
import { Like } from 'typeorm';

@Controller('/api/admin/admin')
export class AdminController {
  @Inject()
  ctx: Context;

  @Inject()
  adminService: AdminService;

  @Get('/:id')
  async getAdmin(@Param('id') id: string) {
    const mdl = await this.adminService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list')
  async getAdminList(@Query() query: IGetAdminListOptions) {
    const result = await this.adminService.getPaginatedList(
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
  async createAdmin(@Body() dto: CreateAdminDTO) {
    const mdl = await this.adminService.createAdmin(<Admin>dto);
    return ajaxSuccessResult(mdl);
  }

  @Put('/:id')
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDTO) {
    const mdl = await this.adminService.updateObject(id, <any>dto);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id')
  async deleteAdmin(@Param('id') id: string) {
    const result = await this.adminService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorResult('id不正确');
    }
    return ajaxSuccessResult();
  }

  @Del('/soft/:id')
  async softDeleteAdmin(@Param('id') id: string) {
    const result = await this.adminService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorResult('id不正确');
    }
    return ajaxSuccessResult();
  }
}
