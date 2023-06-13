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
  CreateDeviceDTO,
  GetDeviceListDTO,
  UpdateDeviceDTO,
} from '../../../dto/areas/admin/device.dto';
import { DeviceEntity } from '../../../entity/device.entity';
import { Like } from 'typeorm';
import { MidwayI18nService } from '@midwayjs/i18n';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { isEmpty, omit } from 'lodash';
import { TenantService } from '../../../service/tenant.service';
import { OrganizationService } from '../../../service/organization.service';
import { BaseAdminController } from './base/base.admin.controller';
import { CommonError } from '../../../error';
import { Role } from '../../../decorator/role.decorator';

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

  @Role(['admin'])
  @Get('/:id', { summary: '管理员-查询单个设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async getDevice(@Param('id') id: string) {
    const mdl = await this.deviceService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    return mdl;
  }

  @Role(['admin'])
  @Get('/list', { summary: '管理员-查询设备列表' })
  @ApiQuery({})
  async getDeviceList(@Query() query: GetDeviceListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.deviceService.getPaginatedList(
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
    return {
      list,
      count,
      currentPage,
      pageSize,
    };
  }

  @Role(['admin'])
  @Post('/create', { summary: '管理员-新建设备' })
  @ApiBody({ description: '设备信息' })
  async createDevice(@Body() dto: CreateDeviceDTO) {
    if (await this.deviceService.checkNameExisted(dto.name)) {
      throw new CommonError('name.exist.message', { group: 'device' });
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      throw new CommonError('organization_id.base.message', {
        group: 'device',
      });
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      throw new CommonError('tenant_id.base.message', {
        group: 'device',
      });
    }
    const mdl = await this.deviceService.createObject(<DeviceEntity>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['admin'])
  @Put('/:id', { summary: '管理员-修改设备' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '设备信息' })
  async updateDevice(@Param('id') id: string, @Body() dto: UpdateDeviceDTO) {
    const mdl = await this.deviceService.getObjectById(id);
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.deviceService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'device' });
    }
    if (
      !(await this.organizationService.exist({
        where: {
          id: dto.organizationId,
        },
      }))
    ) {
      throw new CommonError('organization_id.base.message', {
        group: 'device',
      });
    }
    if (
      !(await this.tenantService.exist({
        where: {
          id: dto.tenantId,
        },
      }))
    ) {
      throw new CommonError('tenant_id.base.message', {
        group: 'device',
      });
    }
    Object.assign(mdl, dto);
    return omit(await this.deviceService.updateObject(mdl), ['deletedDate']);
  }

  @Role(['admin'])
  @Del('/:id', { summary: '管理员-删除设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteDevice(@Param('id') id: string) {
    if (!(await this.deviceService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.deviceService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Del('/soft/:id', { summary: '管理员-软删除设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async softDeleteDevice(@Param('id') id: string) {
    if (!(await this.deviceService.existObjectById(id))) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.deviceService.softDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }

  @Role(['admin'])
  @Post('/restore/:id', { summary: '管理员-恢复软删除设备' })
  @ApiParam({ name: 'id', description: '编号' })
  async restoreDeleteAdmin(@Param('id') id: string) {
    const result = await this.deviceService.restoreDeleteObject(id);
    if (!result.affected) {
      throw new CommonError('restore.failure', { group: 'global' });
    }
    return this.i18nService.translate('restore.success', { group: 'global' });
  }
}
