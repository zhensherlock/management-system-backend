import { Body, Controller, Get, Inject, Put } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { encrypt } from '../util';
import { ApiBearerAuth, ApiBody, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { CommonError } from '../error';
import { Role } from '../decorator/role.decorator';
import {
  UpdatePasswordDTO,
  UpdateUserDTO,
} from '../dto/areas/user/info.dto';
import { omit } from 'lodash';
import { BaseController } from './base/base.controller';
import { AdminService } from '../service/admin.service';

@ApiBearerAuth()
@ApiTags(['basic'])
@Controller('/api/profile')
export class ProfileController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  adminService: AdminService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin', 'school', 'security', 'education'])
  @Get('/basic', { summary: '用户-获取基本信息' })
  async getUser() {
    if (this.ctx.isAdmin) {
      // 管理员信息
      return omit(this.ctx.currentAdmin, ['password', 'salt']);
    } else {
      // 普通用户信息
      return omit(this.ctx.currentUser, ['password', 'salt']);
    }
  }

  @Role(['admin', 'school', 'security', 'education'])
  @Put('/basic', { summary: '用户-修改信息' })
  @ApiBody({ description: '用户信息' })
  async updateUser(@Body() dto: UpdateUserDTO) {
    if (this.ctx.isAdmin) {
      // 管理员
      const admin = this.ctx.currentAdmin;
      if (await this.adminService.checkNameExisted(dto.name, admin.id)) {
        throw new CommonError('name.exist.message', { group: 'admin' });
      }
      Object.assign(admin, dto);
      await this.adminService.updateObject(admin);
      return omit(admin, ['password', 'salt']);
    } else {
      // 普通用户
      const user = this.ctx.currentUser;
      if (await this.userService.checkNameExisted(dto.name, user.id)) {
        throw new CommonError('name.exist.message', { group: 'user' });
      }
      Object.assign(user, dto);
      await this.userService.updateObject(user);
      return omit(user, ['password', 'salt']);
    }
  }

  @Role(['admin', 'school', 'security', 'education'])
  @Put('/password', { summary: '用户-修改密码' })
  async updatePassword(@Body() dto: UpdatePasswordDTO) {
    if (this.ctx.isAdmin) {
      // 管理员
      const admin = this.ctx.currentAdmin;
      if (encrypt(dto.old_password, admin.salt).hash !== admin.password) {
        throw new CommonError('old_password.base.message', { group: 'user' });
      }
      const { hash, salt } = encrypt(dto.new_password);
      admin.password = hash;
      admin.salt = salt;
      await this.adminService.updateObject(admin);
      return this.i18nService.translate('update.password.success', {
        group: 'admin',
      });
    } else {
      // 普通用户
      const user = this.ctx.currentUser;
      if (encrypt(dto.old_password, user.salt).hash !== user.password) {
        throw new CommonError('old_password.base.message', { group: 'user' });
      }
      const { hash, salt } = encrypt(dto.new_password);
      user.password = hash;
      user.salt = salt;
      await this.userService.updateObject(user);
      return this.i18nService.translate('update.password.success', {
        group: 'user',
      });
    }
  }
}
