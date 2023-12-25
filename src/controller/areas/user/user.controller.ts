import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Del,
  File,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
  BodyContentType,
} from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { UserService } from '../../../service/user.service';
import {
  CreateUserDTO,
  GetUserListDTO,
  UpdateUserDTO,
} from '../../../dto/areas/user/user.dto';
import { isArray, isEmpty, isString, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';

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

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询用户列表' })
  @ApiQuery({})
  async getUserList(@Query() query: GetUserListDTO) {
    let organizationUserMappings = [];
    if (isString(query.organizationIds)) {
      organizationUserMappings = [{ organizationId: query.organizationIds }];
    }
    if (isArray(query.organizationIds)) {
      organizationUserMappings = (<string[]>query.organizationIds).map(id => ({
        organizationId: id,
      }));
    }
    let userRoleMappings = [];
    if (isString(query.roleIds)) {
      userRoleMappings = [{ roleId: query.roleIds }];
    }
    if (isArray(query.roleIds)) {
      userRoleMappings = (<string[]>query.roleIds).map(id => ({
        roleId: id,
      }));
    }
    const [list, count, currentPage, pageSize] =
      await this.userService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            organizationUserMappings,
            userRoleMappings,
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
          },
          order: {
            updatedDate: 'DESC',
          },
          relations: [
            'userRoleMappings',
            'userRoleMappings.role',
            'organizationUserMappings',
            'organizationUserMappings.organization',
          ],
        }
      );
    return {
      list,
      count,
      currentPage,
      pageSize,
    };
  }

  @Role(['education'])
  @Post('/import', { summary: '用户-导入用户列表' })
  @ApiBody({
    description: '用户数据文件',
    contentType: BodyContentType.Multipart,
  })
  async import(@File() file) {
    // await this.userService.importList(file.data);
    return this.i18nService.translate('import.success', { group: 'global' });
  }

  @Role(['education'])
  @Post('/create', { summary: '用户-新建用户' })
  @ApiBody({ description: '用户信息' })
  async createUser(@Body() dto: CreateUserDTO) {
    if (await this.userService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'user' });
    }
    const mdl = await this.userService.createUser(dto);
    return omit(mdl, ['password', 'salt', 'deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改用户' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '用户信息' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDTO) {
    const user = await this.userService.getOneObject({
      where: { id },
      relations: ['organizationUserMappings', 'userRoleMappings'],
    });
    if (!user) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.userService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'user' });
    }

    const mdl = await this.userService.updateUser(user, dto);
    return omit(mdl, ['password', 'salt', 'deletedDate']);
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除用户' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteUser(@Param('id') id: string) {
    if (
      !(await this.userService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.userService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
