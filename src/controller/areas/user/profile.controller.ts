import { Body, Controller, Get, Inject, Put } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../../../service/user.service';
import { encrypt } from '../../../util';
import { ApiBearerAuth, ApiBody, ApiTags } from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';
import {
  UpdatePasswordDTO,
  UpdateUserDTO,
} from '../../../dto/areas/user/info.dto';
import { omit } from 'lodash';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/profile')
export class ProfileController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['superAdmin', 'school', 'security', 'education'])
  @Get('/basic', { summary: '用户-获取基本信息' })
  async getUser() {
    const user = this.ctx.currentUser;
    return omit(user, ['password', 'salt']);
  }

  @Role(['superAdmin', 'school', 'security', 'education'])
  @Put('/basic', { summary: '用户-修改信息' })
  @ApiBody({ description: '用户信息' })
  async updateUser(@Body() dto: UpdateUserDTO) {
    const user = this.ctx.currentUser;
    if (await this.userService.checkNameExisted(dto.name, user.id)) {
      throw new CommonError('name.exist.message', { group: 'user' });
    }
    Object.assign(user, dto);
    await this.userService.updateObject(user);
    return omit(user, ['password', 'salt']);
  }

  @Role(['superAdmin', 'school', 'security', 'education'])
  @Put('/password', { summary: '用户-修改密码' })
  async updatePassword(@Body() dto: UpdatePasswordDTO) {
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
