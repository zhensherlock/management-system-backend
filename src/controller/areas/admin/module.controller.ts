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
import { Module } from '../../../entity/module.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';

@ApiTags(['module'])
@Controller('/api/admin/module')
export class ModuleController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  moduleService: ModuleService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async getModule(@Param('id') id: string) {
    const mdl = await this.moduleService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Get('/list', { summary: '查询模块列表' })
  @ApiQuery({})
  async getModuleList(@Query() query: GetModuleListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.moduleService.getPaginatedList(
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
    return {
      list,
      count,
      currentPage,
      pageSize,
    };
  }

  @Get('/tree', { summary: '查询模块树形列表' })
  @ApiQuery({})
  async getModuleTreeList(@Query() query: GetModuleListDTO) {
    const list = await this.moduleService.getTreeList(query.keyword);
    return { list };
  }

  @Post('/create', { summary: '新建模块' })
  @ApiBody({ description: '模块信息' })
  async createModule(@Body() dto: CreateModuleDTO) {
    if (await this.moduleService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'module' });
    }
    if (
      !isEmpty(dto.parentId) &&
      !(await this.moduleService.exist({
        where: {
          id: dto.parentId,
        },
      }))
    ) {
      throw new CommonError('parent_id.base.message', { group: 'module' });
    }
    const mdl = await this.moduleService.createObject(<Module>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Put('/:id', { summary: '修改模块' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '模块信息' })
  async updateModule(@Param('id') id: string, @Body() dto: UpdateModuleDTO) {
    const module = await this.moduleService.getObjectById(id);
    if (!module) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.moduleService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'module' });
    }
    if (
      !isEmpty(dto.parentId) &&
      !(await this.moduleService.exist({
        where: {
          id: dto.parentId,
        },
      }))
    ) {
      throw new CommonError('parent_id.base.message', { group: 'module' });
    }
    Object.assign(module, dto);
    const mdl = await this.moduleService.updateObject(module);
    return omit(mdl, ['deletedDate']);
  }

  @Del('/:id', { summary: '删除模块' })
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

  @Del('/soft/:id', { summary: '软删除模块' })
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

  @Post('/restore/:id', { summary: '恢复软删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.moduleService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
