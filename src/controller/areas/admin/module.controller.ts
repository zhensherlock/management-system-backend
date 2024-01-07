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
import { ModuleService } from '../../../service/module.service';
import {
  CreateModuleDTO,
  GetModuleListDTO,
  UpdateModuleDTO,
} from '../../../dto/areas/admin/module.dto';
import { ModuleEntity } from '../../../entity/module.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit, isString, isArray } from 'lodash';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';

@ApiTags(['module'])
@Controller('/api/admin/module')
export class ModuleController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  moduleService: ModuleService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['admin'])
  @Get('/:id', { summary: '管理员-查询单个模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async getModule(@Param('id') id: string) {
    const mdl = await this.moduleService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['admin'])
  @Get('/list', { summary: '管理员-查询模块列表' })
  @ApiQuery({})
  async getModuleList(@Query() query: GetModuleListDTO) {
    let moduleRoleMappings = [];
    if (isString(query.roleIds)) {
      moduleRoleMappings = [{ roleId: query.roleIds }];
    }
    if (isArray(query.roleIds)) {
      moduleRoleMappings = (<string[]>query.roleIds).map(id => ({
        roleId: id,
      }));
    }
    const [list, count, currentPage, pageSize] =
      await this.moduleService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            moduleRoleMappings,
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
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
  @Get('/tree', { summary: '管理员-查询模块树形列表' })
  @ApiQuery({})
  async getModuleTreeList(@Query() query: GetModuleListDTO) {
    const { list, count } = await this.moduleService.getModuleTreeList(
      query.keyword
    );
    return { list, count };
  }

  @Role(['admin'])
  @Post('/create', { summary: '管理员-新建模块' })
  @ApiBody({ description: '模块信息' })
  async createModule(@Body() dto: CreateModuleDTO) {
    // if (await this.moduleService.checkNameExisted(dto.name)) {
    //   throw new CommonError('name.exist.message', { group: 'module' });
    // }
    const module = <ModuleEntity>dto;
    module.level = 1;
    if (!isEmpty(dto.parentId)) {
      const parentModule = await this.moduleService.getOneObject({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentModule) {
        throw new CommonError('parent_id.base.message', { group: 'module' });
      }
      module.level = parentModule.level + 1;
    }

    const mdl = await this.moduleService.createObject(<ModuleEntity>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['admin'])
  @Put('/:id', { summary: '管理员-修改模块' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '模块信息' })
  async updateModule(@Param('id') id: string, @Body() dto: UpdateModuleDTO) {
    const currentEntity = await this.moduleService.getObjectById(id);
    if (!currentEntity) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    // if (await this.moduleService.checkNameExisted(dto.name, id)) {
    //   throw new CommonError('name.exist.message', { group: 'module' });
    // }
    if (!isEmpty(dto.parentId)) {
      const parentEntity = await this.moduleService.getOneObject({
        where: {
          id: dto.parentId,
        },
      });
      if (!parentEntity) {
        throw new CommonError('parent_id.base.message', { group: 'module' });
      }
      currentEntity.level = parentEntity.level + 1;
    }
    Object.assign(currentEntity, dto);

    return omit(await this.moduleService.updateObject(currentEntity), [
      'deletedDate',
      'roleIds',
      'moduleRoleMappings',
    ]);
  }

  @Role(['admin'])
  @Del('/:id', { summary: '管理员-删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteModule(@Param('id') id: string) {
    if (!(await this.moduleService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.moduleService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Del('/soft/:id', { summary: '管理员-软删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteModule(@Param('id') id: string) {
    if (!(await this.moduleService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.moduleService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Post('/restore/:id', { summary: '管理员-恢复软删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.moduleService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
