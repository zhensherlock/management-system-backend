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
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessMessage,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateRoleDTO,
  GetRoleListDTO,
  UpdateRoleDTO,
} from '../../../dto/areas/admin/role.dto';
import { Role } from '../../../entity/role.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';

@ApiTags(['role'])
@Controller('/api/admin/role')
export class RoleController {
  @Inject()
  ctx: Context;

  @Inject()
  roleService: RoleService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async getRole(@Param('id') id: string) {
    const mdl = await this.roleService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询角色列表' })
  @ApiQuery({})
  async getRoleList(@Query() query: GetRoleListDTO) {
    const result = await this.roleService.getPaginatedList(
      query.currentPage,
      query.pageSize,
      {
        where: {
          ...(isEmpty(query.keyword)
            ? {}
            : { name: Like(`%${query.keyword}%`) }),
        },
      }
    );
    return ajaxListResult({ result });
  }

  @Post('/create', { summary: '新建角色' })
  @ApiBody({ description: '角色信息' })
  async createRole(@Body() dto: CreateRoleDTO) {
    if (await this.roleService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'role' })
      );
    }
    const mdl = await this.roleService.createObject(<Role>dto);
    return ajaxSuccessResult(omit(mdl, ['deletedDate']));
  }

  @Put('/:id', { summary: '修改角色' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '角色信息' })
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDTO) {
    const role = await this.roleService.getObjectById(id);
    if (!role) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.roleService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'role' })
      );
    }
    Object.assign(role, dto);
    const mdl = await this.roleService.updateObject(id, role);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id', { summary: '删除角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteRole(@Param('id') id: string) {
    if (!(await this.roleService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.roleService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Del('/soft/:id', { summary: '软删除角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteRole(@Param('id') id: string) {
    if (!(await this.roleService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.roleService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Post('/restore/:id', { summary: '恢复软删除角色' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.roleService.restoreDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('restore.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('restore.success', { group: 'global' })
    );
  }
}
