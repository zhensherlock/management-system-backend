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
import { OperationService } from '../../../service/operation.service';
import {
  CreateOperationDTO,
  GetOperationListDTO,
  UpdateOperationDTO,
} from '../../../dto/areas/admin/operation.dto';
import { Operation } from '../../../entity/operation.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { ModuleService } from '../../../service/module.service';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';

@ApiTags(['operation'])
@Controller('/api/admin/operation')
export class OperationController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  operationService: OperationService;

  @Inject()
  moduleService: ModuleService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个操作按钮' })
  @ApiParam({ name: 'id', description: '编号' })
  async getOperation(@Param('id') id: string) {
    const mdl = await this.operationService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Get('/list', { summary: '查询操作按钮列表' })
  @ApiQuery({})
  async getOperationList(@Query() query: GetOperationListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.operationService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
            ...(isEmpty(query.module) ? {} : { moduleId: query.module }),
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

  @Post('/create', { summary: '新建操作按钮' })
  @ApiBody({ description: '操作按钮信息' })
  async createOperation(@Body() dto: CreateOperationDTO) {
    if (await this.operationService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'operation' });
    }
    if (
      !isEmpty(dto.moduleId) &&
      !(await this.moduleService.exist({
        where: {
          id: dto.moduleId,
        },
      }))
    ) {
      throw new CommonError('module_id.base.message', { group: 'operation' });
    }
    const mdl = await this.operationService.createObject(<Operation>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Put('/:id', { summary: '修改操作按钮' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '操作按钮信息' })
  async updateOperation(
    @Param('id') id: string,
    @Body() dto: UpdateOperationDTO
  ) {
    const operation = await this.operationService.getObjectById(id);
    if (!operation) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.operationService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'operation' });
    }
    if (
      !isEmpty(dto.moduleId) &&
      !(await this.moduleService.exist({
        where: {
          id: dto.moduleId,
        },
      }))
    ) {
      throw new CommonError('module_id.base.message', { group: 'operation' });
    }
    Object.assign(operation, dto);
    const mdl = await this.operationService.updateObject(operation);
    return omit(mdl, ['deletedDate']);
  }

  @Del('/:id', { summary: '删除操作按钮' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteOperation(@Param('id') id: string) {
    if (!(await this.operationService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.operationService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Del('/soft/:id', { summary: '软删除操作按钮' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteOperation(@Param('id') id: string) {
    if (!(await this.operationService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.operationService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Post('/restore/:id', { summary: '恢复软删除操作按钮' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.operationService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
