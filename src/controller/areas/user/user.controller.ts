import { Inject, Controller, Put, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../../../service/user.service';
import { encrypt } from '../../../util';
import { ApiBearerAuth, ApiBody, ApiTags } from '@midwayjs/swagger';
import { omit } from 'lodash';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';
import {
  UpdatePasswordDTO,
  UpdateUserDTO,
} from '../../../dto/areas/user/user.dto';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/user')
export class UserController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security'])
  @Put('/:id', { summary: '用户-修改信息' })
  @ApiBody({ description: '用户信息' })
  async updateUser(@Body() dto: UpdateUserDTO) {
    const user = this.ctx.currentUser;
    if (await this.userService.checkNameExisted(dto.name, user.id)) {
      throw new CommonError('name.exist.message', { group: 'user' });
    }
    const mdl = await this.userService.updateUser(user, dto as any);
    return omit(mdl, [
      'password',
      'salt',
      'deletedDate',
      'organizationUserMappings',
      'organizationIds',
      'userRoleMappings',
      'roleIds',
    ]);
  }

  @Role(['school', 'security'])
  @Put('/password/', { summary: '用户-修改密码' })
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
