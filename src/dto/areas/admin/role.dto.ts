import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { PermissionType } from '../../../types';

export class RoleDTO {
  @ApiProperty({ example: '管理员', description: '角色名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'role' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'role' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'role' },
          },
          '*': {
            message: 'name.base.message',
            options: { group: 'role' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: 'code', description: '角色代码' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'code.required.message',
            options: { group: 'role' },
          },
          'any.required': {
            message: 'code.required.message',
            options: { group: 'role' },
          },
          'string.max': {
            message: 'code.length.message',
            options: { group: 'role' },
          },
          '*': {
            message: 'code.base.message',
            options: { group: 'role' },
          },
        })
      )
  )
  code: string;

  @ApiProperty({ example: '系统管理介绍', description: '角色简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .allow(null)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'role' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'role' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: true, description: '角色状态' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'enabled.base.message',
        options: { group: 'role' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '角色扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
        options: { group: 'role' },
      })
    )
  )
  options: object;
}

export class CreateRoleDTO extends RoleDTO {}

export class UpdateRoleDTO extends RoleDTO {}

export class UpdatePermissionDTO {
  @ApiProperty({ example: [], description: '权限列表' })
  @Rule(RuleType.array().items(RuleType.object<PermissionType>()))
  permissions: PermissionType[];
}

export class GetRoleListDTO extends GetListBaseDTO {}
