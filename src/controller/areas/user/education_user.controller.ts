// import {
//   Inject,
//   Controller,
//   Get,
//   Query,
//   Post,
//   Body,
//   Put,
//   Param,
//   Del,
// } from '@midwayjs/core';
// import { Context } from '@midwayjs/koa';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiParam,
//   ApiQuery,
//   ApiTags,
// } from '@midwayjs/swagger';
// import { MidwayI18nService } from '@midwayjs/i18n';
// import { BaseUserController } from './base/base.user.controller';
// import { Role } from '../../../decorator/role.decorator';
// import {
//   CreateCompanyDTO,
//   GetCompanyListDTO,
//   UpdateCompanyDTO,
// } from '../../../dto/areas/user/company.dto';
// import { isEmpty, omit } from 'lodash';
// import { Like } from 'typeorm';
// import { CommonError } from '../../../error';
// import { UserType } from '../../../constant';
// import { UserService } from '../../../service/user.service';
// import { UserEntity } from '../../../entity/user.entity';
//
// @ApiBearerAuth()
// @ApiTags(['user'])
// @Controller('/api/user/education')
// export class EducationController extends BaseUserController {
//   @Inject()
//   ctx: Context;
//
//   @Inject()
//   userService: UserService;
//
//   @Inject()
//   i18nService: MidwayI18nService;
//
//   @Role(['education'])
//   @Get('/list', { summary: '用户-查询市管理员列表' })
//   @ApiQuery({})
//   async getEducationUserList(@Query() query: GetCompanyListDTO) {
//     const tenantId = this.ctx.currentUser.tenantId;
//     const [list, count, currentPage, pageSize] =
//       await this.userService.getPaginatedList(
//         query.currentPage,
//         query.pageSize,
//         {
//           where: {
//             tenantId,
//             type: UserType.Education,
//             ...(isEmpty(query.keyword)
//               ? {}
//               : { name: Like(`%${query.keyword}%`) }),
//           },
//         }
//       );
//     return {
//       list,
//       count,
//       currentPage,
//       pageSize,
//     };
//   }
//
//   @Role(['education'])
//   @Post('/create', { summary: '用户-新建市管理员' })
//   @ApiBody({ description: '市管理员信息' })
//   async createCompany(@Body() dto: CreateCompanyDTO) {
//     const tenantId = this.ctx.currentUser.tenantId;
//     if (await this.userService.checkNameExisted(dto.name, tenantId)) {
//       throw new CommonError('name.exist.message', { group: 'organization' });
//     }
//     const user = <UserEntity>dto;
//     user.tenantId = tenantId;
//     user.type = UserType.Education;
//     user.enabled = true;
//     const mdl = await this.userService.createObject(
//       <UserEntity>dto
//     );
//     return omit(mdl, ['deletedDate']);
//   }
//
//   @Role(['education'])
//   @Put('/:id', { summary: '用户-修改保安公司' })
//   @ApiParam({ name: 'id', description: '编号' })
//   @ApiBody({ description: '保安公司信息' })
//   async updateCompany(@Param('id') id: string, @Body() dto: UpdateCompanyDTO) {
//     const tenantId = this.ctx.currentUser.tenantId;
//     const mdl = await this.userService.getOneObject({
//       where: {
//         id,
//         type: UserType.Education,
//         tenantId,
//       },
//     });
//     if (!mdl) {
//       throw new CommonError('not.exist', { group: 'global' });
//     }
//     if (
//       await this.userService.checkNameExisted(dto.name, tenantId, id)
//     ) {
//       throw new CommonError('name.exist.message', { group: 'organization' });
//     }
//
//     Object.assign(mdl, dto);
//     mdl.tenantId = tenantId;
//
//     return omit(await this.userService.updateObject(mdl), [
//       'deletedDate',
//     ]);
//   }
//
//   @Role(['education'])
//   @Del('/:id', { summary: '用户-软删除保安公司' })
//   @ApiParam({ name: 'id', description: '编号' })
//   async softDeleteEmployee(@Param('id') id: string) {
//     if (
//       !(await this.userService.existObject({
//         where: {
//           id,
//           type: UserType.Education,
//           tenantId: this.ctx.currentUser.tenantId,
//         },
//       }))
//     ) {
//       throw new CommonError('not.exist', { group: 'global' });
//     }
//     const result = await this.userService.softDeleteObject(id);
//     if (!result.affected) {
//       throw new CommonError('delete.failure', { group: 'global' });
//     }
//     return this.i18nService.translate('delete.success', { group: 'global' });
//   }
// }
