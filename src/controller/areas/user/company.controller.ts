import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Del,
  File,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
  BodyContentType,
} from '@midwayjs/swagger';
import { MidwayI18nService } from '@midwayjs/i18n';
import { BaseUserController } from './base/base.user.controller';
import { Role } from '../../../decorator/role.decorator';
import { CompanyService } from '../../../service/company.service';
import {
  CreateCompanyDTO,
  GetCompanyListDTO,
  UpdateCompanyDTO,
} from '../../../dto/areas/user/company.dto';
import { isEmpty, omit } from 'lodash';
import { Like } from 'typeorm';
import { CommonError } from '../../../error';
import { CompanyEntity } from '../../../entity/company.entity';

@ApiBearerAuth()
@ApiTags(['user'])
@Controller('/api/user/company')
export class CompanyController extends BaseUserController {
  @Inject()
  ctx: Context;

  @Inject()
  companyService: CompanyService;

  @Inject()
  i18nService: MidwayI18nService;

  @Role(['school', 'security', 'education'])
  @Get('/list', { summary: '用户-查询保安公司列表' })
  @ApiQuery({})
  async getCompanyList(@Query() query: GetCompanyListDTO) {
    const [list, count, currentPage, pageSize] =
      await this.companyService.getPaginatedList(
        query.currentPage,
        query.pageSize,
        {
          where: {
            ...(isEmpty(query.keyword)
              ? {}
              : { name: Like(`%${query.keyword}%`) }),
          },
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

  @Role(['education'])
  @Post('/import', { summary: '用户-导入保安公司列表' })
  @ApiBody({
    description: '用户数据文件',
    contentType: BodyContentType.Multipart,
  })
  async importUsers(@File() file) {
    await this.companyService.importList(file.data);
    return this.i18nService.translate('import.success', { group: 'global' });
  }

  @Role(['education'])
  @Post('/create', { summary: '用户-新建保安公司' })
  @ApiBody({ description: '保安公司信息' })
  async createCompany(@Body() dto: CreateCompanyDTO) {
    const tenantId = this.ctx.currentUser.tenantId;
    if (await this.companyService.checkNameExisted(dto.name, tenantId)) {
      throw new CommonError('name.exist.message', { group: 'company' });
    }
    const company = <CompanyEntity>dto;
    company.enabled = true;
    const mdl = await this.companyService.createObject(<CompanyEntity>dto);
    return omit(mdl, ['deletedDate']);
  }

  @Role(['education'])
  @Put('/:id', { summary: '用户-修改保安公司' })
  @ApiParam({ name: 'id', description: '编号' })
  @ApiBody({ description: '保安公司信息' })
  async updateCompany(@Param('id') id: string, @Body() dto: UpdateCompanyDTO) {
    const mdl = await this.companyService.getOneObject({
      where: {
        id,
      },
    });
    if (!mdl) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    if (await this.companyService.checkNameExisted(dto.name, id)) {
      throw new CommonError('name.exist.message', { group: 'company' });
    }

    Object.assign(mdl, dto);

    return omit(await this.companyService.updateObject(mdl), ['deletedDate']);
  }

  @Role(['education'])
  @Del('/:id', { summary: '用户-删除保安公司' })
  @ApiParam({ name: 'id', description: '编号' })
  async deleteCompany(@Param('id') id: string) {
    if (
      !(await this.companyService.existObject({
        where: {
          id,
        },
      }))
    ) {
      throw new CommonError('not.exist', { group: 'global' });
    }
    const result = await this.companyService.deleteObject(id);
    if (!result.affected) {
      throw new CommonError('delete.failure', { group: 'global' });
    }
    return this.i18nService.translate('delete.success', { group: 'global' });
  }
}
