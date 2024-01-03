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
import { RoleService } from '../../../service/role.service';
import {
  CreateRoleDTO,
  GetRoleListDTO,
  UpdatePermissionDTO,
  UpdateRoleDTO,
} from '../../../dto/areas/admin/role.dto';
import { RoleEntity } from '../../../entity/role.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { differenceWith, isEmpty, omit } from 'lodash';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';
import { ModuleRoleMappingService } from '../../../service/module_role_mapping.service';

@ApiTags(['role'])
@Controller('/api/admin/role')
export class RoleController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  roleService: RoleService;

  @Inject()
  moduleRoleMappingService: ModuleRoleMappingService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin'])
  @Get('/:id', { summary: '管理员-查询单个角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async getRole(@Param('id') id: string) {
    const mdl = await this.roleService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['admin'])
  @Get('/list', { summary: '管理员-查询角色列表' })
  @ApiQuery({})
  async getRoleList(@Query() query: GetRoleListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.roleService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
          },
          relations: ['moduleRoleMappings'],
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
  @Post('/create', { summary: '管理员-新建角色' })
  @ApiBody({ description: '角色信息' })
  async createRole(@Body() dto: CreateRoleDTO) {
    if (await this.roleService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'role' });
    }
    const mdl = await this.roleService.createObject(<RoleEntity>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['admin'])
  @Put('/:id', { summary: '管理员-修改角色' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '角色信息' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDTO) {
    const role = await this.roleService.getObjectById(id);
    if (!role) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.roleService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'role' });
    }
    Object.assign(role, dto);
    const mdl = await this.roleService.updateObject(role);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['admin'])
  @Post('/permission/:id', { summary: '管理员-修改权限' })
  @ApiParam({ name: 'id', description: '角色编号' })
  @ApiBody({ description: '角色信息' })
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDTO
  ) {
    const role = await this.roleService.getOneObject({
      where: {
        id,
      },
      relations: ['moduleRoleMappings'],
    });
    if (!role) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const removeModuleRoleMappings = differenceWith(
      role.moduleRoleMappings,
      dto.permissions,
      (a, b) => a.moduleId === b.moduleId
    );
    await this.moduleRoleMappingService.entityModel.remove(
      removeModuleRoleMappings
    );
    role.moduleRoleMappings = (dto.permissions || []).map(item =>
      this.moduleRoleMappingService.entityModel.create({
        roleId: role.id,
        moduleId: item.moduleId,
        operationOptions: item.operationOptions,
      })
    );
    const mdl = await this.roleService.updateObject(role);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['admin'])
  @Del('/:id', { summary: '管理员-删除角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteRole(@Param('id') id: string) {
    if (!(await this.roleService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.roleService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Del('/soft/:id', { summary: '管理员-软删除角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteRole(@Param('id') id: string) {
    if (!(await this.roleService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.roleService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Post('/restore/:id', { summary: '管理员-恢复软删除角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.roleService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
