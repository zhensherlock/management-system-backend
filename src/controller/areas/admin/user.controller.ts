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
import {
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessResult,
  encrypt,
  generatePassword,
} from '../../../util';
import {
  CreateUserDTO,
  GetUserListDTO,
  UpdateUserDTO,
} from '../../../dto/areas/admin/user.dto';
import { User } from '../../../entity/user.entity';
import { Like } from 'typeorm';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { MidwayI18nService } from '@midwayjs/i18n';

@ApiTags(['user'])
@Controller('/api/user/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async getUser(@Param('id') id: string) {
    const mdl = await this.userService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询用户列表' })
  @ApiQuery({})
  async getUserList(@Query() query: GetUserListDTO) {
    const result = await this.userService.getPaginatedList(
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
    return ajaxListResult({ result });
  }

  @Post('/create', { summary: '新建用户' })
  @ApiBody({ description: '用户信息' })
  async createUser(@Body() dto: CreateUserDTO) {
    if (await this.userService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'user' })
      );
    }
    const { hash, salt } = encrypt(dto.password);
    const mdl = await this.userService.createObject(
      <User>Object.assign({}, dto, {
        password: hash,
        salt,
      })
    );
    return ajaxSuccessResult(omit(mdl, ['password', 'salt', 'deletedDate']));
  }

  @Put('/:id', { summary: '修改用户' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '用户信息' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    const user = await this.userService.getObjectById(id);
    if (!user) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.userService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'user' })
      );
    }
    Object.assign(user, dto);
    if (!isEmpty(dto.new_password)) {
      const { hash, salt } = encrypt(dto.new_password);
      user.password = hash;
      user.salt = salt;
    }
    const mdl = await this.userService.updateObject(id, user);
    return ajaxSuccessResult(mdl);
  }

  @Put('/password/:id', { summary: '重置用户密码' })
  @ApiParam({ name: 'id', description: '编号' })
  async resetUserPassword(@Param('id') id: string) {
    const user = await this.userService.getObjectById(id);
    if (!user) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const { hash, salt } = encrypt(generatePassword());
    user.password = hash;
    user.salt = salt;
    await this.userService.updateObject(id, user);
    return ajaxSuccessResult();
  }

  @Del('/:id', { summary: '删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteUser(@Param('id') id: string) {
    if (!(await this.userService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.userService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessResult();
  }

  @Del('/soft/:id', { summary: '软删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteUser(@Param('id') id: string) {
    if (!(await this.userService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.userService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessResult();
  }

  @Post('/restore/:id', { summary: '恢复软删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteUser(@Param('id') id: string) {
    const result = await this.userService.restoreDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('restore.failure', { group: 'global' })
      );
    }
    return ajaxSuccessResult();
  }
}
