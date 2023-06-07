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
import { DeviceService } from '../../../service/device.service';
import {
  ajaxErrorMessage,
  ajaxListResult,
  ajaxSuccessMessage,
  ajaxSuccessResult,
} from '../../../util';
import {
  CreateDeviceDTO,
  GetDeviceListDTO,
  UpdateDeviceDTO,
} from '../../../dto/areas/admin/device.dto';
import { Device } from '../../../entity/device.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { TenantService } from '../../../service/tenant.service';
import { OrganizationService } from '../../../service/organization.service';
import { BaseAdminController } from './base/base.admin.controller';

@ApiTags(['device'])
@Controller('/api/admin/device')
export class DeviceController extends BaseAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  deviceService: DeviceService;

  @Inject()
  tenantService: TenantService;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Get('/:id', { summary: '查询单个设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async getDevice(@Param('id') id: string) {
    const mdl = await this.deviceService.getObjectById(id);
    return ajaxSuccessResult(mdl);
  }

  @Get('/list', { summary: '查询设备列表' })
  @ApiQuery({})
  async getDeviceList(@Query() query: GetDeviceListDTO) {
    const result = await this.deviceService.getPaginatedList(
      query.currentPage,
      query.pageSize,
      {
        where: {
          tenantId: query.tenantId,
          ...(isEmpty(query.organizationId)
            ? {}
            : { organizationId: query.organizationId }),
          ...(isEmpty(query.keyword)
            ? {}
            : { name: Like(`%${query.keyword}%`) }),
        },
      }
    );
    return ajaxListResult({ result });
  }

  @Post('/create', { summary: '新建设备' })
  @ApiBody({ description: '设备信息' })
  async createDevice(@Body() dto: CreateDeviceDTO) {
    if (await this.deviceService.checkNameExisted(dto.name)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', {
          group: 'device',
        })
      );
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('organization_id.base.message', {
          group: 'device',
        })
      );
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('tenant_id.base.message', {
          group: 'device',
        })
      );
    }
    const mdl = await this.deviceService.createObject(<Device>dto);
    return ajaxSuccessResult(omit(mdl, ['deletedDate']));
  }

  @Put('/:id', { summary: '修改设备' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '设备信息' })
  async updateDevice(@Param('id') id: string, @Body() dto: UpdateDeviceDTO) {
    const device = await this.deviceService.getObjectById(id);
    if (!device) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    if (await this.deviceService.checkNameExisted(dto.name, id)) {
      return ajaxErrorMessage(
        this.i18nService.translate('name.exist.message', {
          group: 'device',
        })
      );
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('organization_id.base.message', {
          group: 'device',
        })
      );
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      return ajaxErrorMessage(
        this.i18nService.translate('tenant_id.base.message', {
          group: 'device',
        })
      );
    }
    Object.assign(device, dto);
    const mdl = await this.deviceService.updateObject(id, device);
    return ajaxSuccessResult(mdl);
  }

  @Del('/:id', { summary: '删除设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteDevice(@Param('id') id: string) {
    if (!(await this.deviceService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.deviceService.deleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Del('/soft/:id', { summary: '软删除设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteDevice(@Param('id') id: string) {
    if (!(await this.deviceService.existObjectById(id))) {
      return ajaxErrorMessage(
        this.i18nService.translate('not.exist', { group: 'global' })
      );
    }
    const result = await this.deviceService.softDeleteObject(id);
    if (!result.affected) {
      return ajaxErrorMessage(
        this.i18nService.translate('delete.failure', { group: 'global' })
      );
    }
    return ajaxSuccessMessage(
      this.i18nService.translate('delete.success', { group: 'global' })
    );
  }

  @Post('/restore/:id', { summary: '恢复软删除设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.deviceService.restoreDeleteObject(id);
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
