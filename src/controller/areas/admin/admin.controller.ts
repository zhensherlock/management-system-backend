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
  encrypt,
  generatePassword,
} from '../../../util';
import {
  CreateAdminDTO,
  GetAdminListDTO,
  UpdateAdminDTO,
} from '../../../dto/areas/admin/admin.dto';
import { Admin } from '../../../entity/admin.entity';
import { Like } from 'typeorm';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
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
    const { hash, salt } = encrypt(dto.password);
    const mdl = await this.adminService.createObject(
      <Admin>Object.assign({}, dto, {
        password: hash,
        salt,
      })
    );
    return ajaxSuccessResult(omit(mdl, ['password', 'salt', 'deletedDate']));
  }

  @Put('/:id', { summary: '修改管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '管理员信息' })
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDTO) {
    const admin = await this.adminService.getObjectById(id);
    if (!admin) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.adminService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'admin' })
      );
    }
    Object.assign(admin, dto);
    if (!isEmpty(dto.new_password)) {
      const { hash, salt } = encrypt(dto.new_password);
      admin.password = hash;
      admin.salt = salt;
    }
    const mdl = await this.adminService.updateObject(id, admin);
    return ajaxSuccessResult(mdl);
  }

  @Put('/password/:id', { summary: '重置管理员密码' })
  @ApiParam({ name: 'id', description: '编号' })
  async resetAdminPassword(@Param('id') id: string) {
    const admin = await this.adminService.getObjectById(id);
    if (!admin) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const { hash, salt } = encrypt(generatePassword());
    admin.password = hash;
    admin.salt = salt;
    await this.adminService.updateObject(id, admin);
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

  @Post('/restore/:id', { summary: '恢复软删除管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.adminService.restoreDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('restore.failure', { group: 'global' })
      );
    }
    return ajaxSuccessResult();
  }
}
