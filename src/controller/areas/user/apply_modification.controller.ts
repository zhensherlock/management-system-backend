import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Del,
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
import { ApplyModificationService } from '../../../service/apply_modification.service';
import {
  AuditApplyModificationDTO,
  CreateApplyModificationDTO,
  GetApplyModificationListDTO,
} from '../../../dto/areas/user/apply_modification.dto';
import { omit } from 'lodash';
import { CommonError } from '../../../error';
import { ApplyModificationEntity } from '../../../entity/apply_modification.entity';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/apply_modification')
export class ApplyModificationController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  applyModificationService: ApplyModificationService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询考核类型列表' })
  @ApiQuery({})
  async getApplyModificationList(@Query() query: GetApplyModificationListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.applyModificationService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {},
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
  async createApplyModification(@Body() dto: CreateApplyModificationDTO) {
    const user = this.ctx.currentUser;
    const applyModification = <ApplyModificationEntity>dto;
    applyModification.applyUserId = user.id;
    applyModification.status = 'pending';
    const mdl = await this.applyModificationService.createObject(
      applyModification
    );
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Post('/audit/:id', { summary: '教育局用户-审核工单' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '审核信息' })
  async auditApplyModification(
    @Param('id') id: string,
    @Body() dto: AuditApplyModificationDTO
  ) {
    const mdl = await this.applyModificationService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (mdl.status !== 'pending') {
      throw new CommonError('has.been.reviewed', {
        group: 'apply_modification',
      });
    }

    mdl.auditUserId = this.ctx.currentUser.id;

    Object.assign(mdl, dto);

    return omit(await this.applyModificationService.updateObject(mdl), [
      'deletedDate',
    ]);
  }

  @Role(['security'])
  @Del('/:id', { summary: '保安公司用户-取消工单' })
  @ApiParam({ name: 'id', description: '编号' })
  async cancelApplyModification(@Param('id') id: string) {
    const user = this.ctx.currentUser;
    const applyModification = await this.applyModificationService.getOneObject({
      where: {
        id,
        applyUserId: user.id,
      },
    });
    if (!applyModification) {
      throw new CommonError('not.exist', { group: 'global' });
    }

    if (applyModification.status !== 'pending') {
      throw new CommonError('cannot.be.cancelled', {
        group: 'apply_modification',
      });
    }
    const result = await this.applyModificationService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
