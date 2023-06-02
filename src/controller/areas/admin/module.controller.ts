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
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessMessage,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateModuleDTO,
  GetModuleListDTO,
  UpdateModuleDTO,
} from '../../../dto/areas/admin/module.dto';
import { Module } from '../../../entity/module.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty } from 'lodash';

@ApiTags(['module'])
@Controller('/api/admin/module')
export class ModuleController {
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
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询模块列表' })
  @ApiQuery({})
  async getModuleList(@Query() query: GetModuleListDTO) {
    const result = await this.moduleService.getPaginatedList(
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

  @Post('/create', { summary: '新建模块' })
  @ApiBody({ description: '模块信息' })
  async createModule(@Body() dto: CreateModuleDTO) {
    if (await this.moduleService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'module' })
      );
    }
    const mdl = await this.moduleService.createObject(<Module>dto);
    return ajaxSuccessResult(mdl);
  }

  @Put('/:id', { summary: '修改模块' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '模块信息' })
  async updateModule(@Param('id') id: string, @Body() dto: UpdateModuleDTO) {
    const module = await this.moduleService.getObjectById(id);
    if (!module) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.moduleService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', { group: 'module' })
      );
    }
    Object.assign(module, dto);
    const mdl = await this.moduleService.updateObject(id, module);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id', { summary: '删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteModule(@Param('id') id: string) {
    if (!(await this.moduleService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.moduleService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Del('/soft/:id', { summary: '软删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteModule(@Param('id') id: string) {
    if (!(await this.moduleService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.moduleService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Post('/restore/:id', { summary: '恢复软删除模块' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.moduleService.restoreDeleteObject(id);
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
