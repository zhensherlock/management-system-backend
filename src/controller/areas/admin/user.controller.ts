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
import { UserService } from '../../../service/user.service';
import { encrypt, generatePassword } from '../../../util';
import {
  CreateUserDTO,
  GetUserListDTO,
  UpdateUserDTO,
} from '../../../dto/areas/admin/user.dto';
import { UserEntity } from '../../../entity/user.entity';
import { Like } from 'typeorm';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';

@ApiTags(['user'])
@Controller('/api/admin/user')
export class UserController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin'])
  @Get('/:id', { summary: '管理员-查询单个用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async getUser(@Param('id') id: string) {
    const mdl = await this.userService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['admin'])
  @Get('/list', { summary: '管理员-查询用户列表' })
  @ApiQuery({})
  async getUserList(@Query() query: GetUserListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.userService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            tenantId: query.tenantId,
            ...(isEmpty(query.type) ? {} : { type: query.type }),
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
  @Post('/create', { summary: '管理员-新建用户' })
  @ApiBody({ description: '用户信息' })
  async createUser(@Body() dto: CreateUserDTO) {
    if (await this.userService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'user' });
    }
    const { hash, salt } = encrypt(dto.password);
    const mdl = await this.userService.createObject(
      <UserEntity>Object.assign({}, dto, {
        password: hash,
        salt,
      })
    );
    return omit(mdl, ['password', 'salt', 'deletedDate']);
  }

  @Role(['admin'])
  @Put('/:id', { summary: '管理员-修改用户' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '用户信息' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    const user = await this.userService.getObjectById(id);
    if (!user) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.userService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'user' });
    }
    Object.assign(user, dto);
    if (!isEmpty(dto.new_password)) {
      const { hash, salt } = encrypt(dto.new_password);
      user.password = hash;
      user.salt = salt;
    }
    const mdl = await this.userService.updateObject(user);
    return omit(mdl, ['password', 'salt', 'deletedDate']);
  }

  @Role(['admin'])
  @Put('/password/:id', { summary: '管理员-重置用户密码' })
  @ApiParam({ name: 'id', description: '编号' })
  async resetUserPassword(@Param('id') id: string) {
    const user = await this.userService.getObjectById(id);
    if (!user) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const newPassword = generatePassword();
    const { hash, salt } = encrypt(newPassword);
    user.password = hash;
    user.salt = salt;
    await this.userService.updateObject(user);
    return { newPassword };
  }

  @Role(['admin'])
  @Del('/:id', { summary: '管理员-删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteUser(@Param('id') id: string) {
    if (!(await this.userService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.userService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Del('/soft/:id', { summary: '软删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteUser(@Param('id') id: string) {
    if (!(await this.userService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.userService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Post('/restore/:id', { summary: '恢复软删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteUser(@Param('id') id: string) {
    const result = await this.userService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
