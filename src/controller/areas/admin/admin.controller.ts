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
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateAdminDTO,
  GetAdminListDTO,
  UpdateAdminDTO,
  UpdateAdminPasswordDTO,
} from '../../../dto/areas/admin/admin.dto';
import { Admin } from '../../../entity/admin.entity';
import { Like } from 'typeorm';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty } from 'lodash';
import { MidwayI18nService } from '@midwayjs/i18n';

@ApiTags(['admin'])
@Controller('/api/admin/admin')
export class AdminController {
  @Inject()
  ctx: Context;

  @Inject()
  adminService: AdminService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async getAdmin(@Param('id') id: string) {
    const mdl = await this.adminService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询管理员列表' })
  @ApiQuery({})
  async getAdminList(@Query() query: GetAdminListDTO) {
    const result = await this.adminService.getPaginatedList(
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
    return ajaxListResult({ result });
  }

  @Post('/create', { summary: '新建管理员' })
  @ApiBody({ description: '管理员信息' })
  async createAdmin(@Body() dto: CreateAdminDTO) {
    if (await this.adminService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'admin' })
      );
    }
    const mdl = await this.adminService.createAdmin(<Admin>dto);
    return ajaxSuccessResult(mdl);
  }

  @Put('/:id', { summary: '修改管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '管理员信息' })
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDTO) {
    const mdl = await this.adminService.updateAdmin(id, <any>dto);
    return ajaxSuccessResult(mdl);
  }

  @Put('/password/:id', { summary: '修改管理员密码' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '管理员信息' })
  async updateAdminPassword(
    @Param('id') id: string,
    @Body() dto: UpdateAdminPasswordDTO
  ) {
    await this.adminService.updateAdminPassword(id, <any>dto);
    return ajaxSuccessResult();
  }

  @Del('/:id', { summary: '删除管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteAdmin(@Param('id') id: string) {
    if (!(await this.adminService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.adminService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessResult();
  }

  @Del('/soft/:id', { summary: '软删除管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteAdmin(@Param('id') id: string) {
    if (!(await this.adminService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.adminService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessResult();
  }
}
