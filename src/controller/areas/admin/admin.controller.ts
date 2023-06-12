import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AdminService } from '../../../service/admin.service';
import { encrypt, generatePassword } from '../../../util';
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
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';

@ApiTags(['admin'])
@Controller('/api/admin/admin')
export class AdminController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  adminService: AdminService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin'])
  @Get('/:id', { summary: '查询单个管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async getAdmin(@Param('id') id: string) {
    const mdl = await this.adminService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['admin'])
  @Get('/list', { summary: '查询管理员列表' })
  @ApiQuery({})
  async getAdminList(@Query() query: GetAdminListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.adminService.getPaginatedList(
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

  @Role(['admin'])
  @Post('/create', { summary: '新建管理员' })
  @ApiBody({ description: '管理员信息' })
  async createAdmin(@Body() dto: CreateAdminDTO) {
    if (await this.adminService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'admin' });
    }
    const { hash, salt } = encrypt(dto.password);
    const mdl = await this.adminService.createObject(
      <Admin>Object.assign({}, dto, {
        password: hash,
        salt,
      })
    );
    return omit(mdl, ['password', 'salt', 'deletedDate']);
  }

  @Role(['admin'])
  @Put('/:id', { summary: '修改管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '管理员信息' })
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDTO) {
    const mdl = await this.adminService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.adminService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'admin' });
    }
    Object.assign(mdl, dto);
    if (!isEmpty(dto.new_password)) {
      const { hash, salt } = encrypt(dto.new_password);
      mdl.password = hash;
      mdl.salt = salt;
    }
    return omit(await this.adminService.updateObject(mdl), ['deletedDate']);
  }

  @Role(['admin'])
  @Put('/password/:id', { summary: '重置管理员密码' })
  @ApiParam({ name: 'id', description: '编号' })
  async resetAdminPassword(@Param('id') id: string) {
    const mdl = await this.adminService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const { hash, salt } = encrypt(generatePassword());
    mdl.password = hash;
    mdl.salt = salt;
    await this.adminService.updateObject(mdl);
    return this.i18nService.translate('reset.success', { group: 'global' });
  }

  @Role(['admin'])
  @Del('/:id', { summary: '删除管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteAdmin(@Param('id') id: string) {
    if (!(await this.adminService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.adminService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Del('/soft/:id', { summary: '软删除管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteAdmin(@Param('id') id: string) {
    if (!(await this.adminService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.adminService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Post('/restore/:id', { summary: '恢复软删除管理员' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.adminService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
