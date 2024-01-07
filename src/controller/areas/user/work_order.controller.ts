import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { WorkOrderService } from '../../../service/work_order.service';
import {
  AuditWorkOrderDTO,
  CreateWorkOrderDTO,
  GetWorkOrderListDTO,
} from '../../../dto/areas/user/work_order.dto';
import { omit } from 'lodash';
import { CommonError } from '../../../error';
import { WorkOrderEntity } from '../../../entity/work_order.entity';
import { WorkOrderStatus } from '../../../constant/work_order.constant';
import { EmployeeService } from '../../../service/employee.service';
import { WorkOrderContentType } from '../../../types';
import { hasRole } from '../../../util/permission';
import type { FindOptionsWhere } from 'typeorm';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/work_order')
export class WorkOrderController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  workOrderService: WorkOrderService;

  @Inject()
  employeeService: EmployeeService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['security', 'education'])
  @Get('/list', { summary: '用户-查询工单列表' })
  @ApiQuery({})
  async getWorkOrderList(@Query() query: GetWorkOrderListDTO) {
    const user = this.ctx.currentUser;
    const where: FindOptionsWhere<WorkOrderEntity> = {};
    if (hasRole(user.roles, 'security')) {
      where.applyUserId = user.id;
    }
    const [list, count, currentPage, pageSize] =
      await this.workOrderService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where,
          order: {
            updatedDate: 'DESC',
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

  @Role(['security'])
  @Post('/create', { summary: '保安公司用户-新建工单' })
  @ApiBody({ description: '申请信息' })
  async createWorkOrder(@Body() dto: CreateWorkOrderDTO) {
    const user = this.ctx.currentUser;
    const workOrder = <WorkOrderEntity>dto;
    workOrder.applyUserId = user.id;
    workOrder.status = WorkOrderStatus.Pending;
    const mdl = await this.workOrderService.createObject(workOrder);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Post('/audit/:id', { summary: '教育局用户-审核工单' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '审核信息' })
  async auditWorkOrder(
    @Param('id') id: string,
    @Body() dto: AuditWorkOrderDTO
  ) {
    const mdl = await this.workOrderService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (mdl.status !== 'pending') {
      throw new CommonError('has.been.reviewed', {
        group: 'work_order',
      });
    }

    mdl.auditUserId = this.ctx.currentUser.id;

    Object.assign(mdl, dto);

    if (dto.status === WorkOrderStatus.Completed) {
      await this.employeeService.updateEmployeeByWorkOrder(
        dto.employeeId,
        <WorkOrderContentType>mdl.content
      );
    }

    return omit(await this.workOrderService.updateObject(mdl), ['deletedDate']);
  }

  @Role(['security'])
  @Post('/cancel/:id', { summary: '保安公司用户-取消工单' })
  @ApiParam({ name: 'id', description: '编号' })
  async cancelWorkOrder(@Param('id') id: string) {
    const user = this.ctx.currentUser;
    const workOrder = await this.workOrderService.getOneObject({
      where: {
        id,
        applyUserId: user.id,
      },
    });
    if (!workOrder) {
      throw new CommonError('not.exist', { group: 'global' });
    }

    if (workOrder.status !== WorkOrderStatus.Pending) {
      throw new CommonError('cannot.be.cancelled', {
        group: 'work_order',
      });
    }
    const result = await this.workOrderService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}