import { Rule, RuleType } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class RoleDTO {
  @ApiProperty({ example: '管理员', description: '角色名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'role' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'role' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'role' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'role' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '系统管理介绍', description: '角色简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'role' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'role' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: true, description: '角色是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:enabled.base.message',
        options: { group: 'role' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '角色扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'role' },
      })
    )
  )
  options: object;
}

export class CreateRoleDTO extends RoleDTO {}

export class UpdateRoleDTO extends RoleDTO {}

export class GetRoleListDTO extends GetListBaseDTO {
  @ApiProperty({ description: '所属模块编号', example: null })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .empty('')
      .error(
        handleError({
          message: 'i18n:module_id.base.message',
          options: { group: 'role' },
        })
      )
  )
  module: string;
}
