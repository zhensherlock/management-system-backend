import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { UserType } from '../../../constant';

export class UserDTO {
  @ApiProperty({ example: 'user1', description: '用户登录名' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'user' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'name.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: 'user1@hy.com', description: '用户邮箱' })
  @Rule(
    RuleType.string()
      .email()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'email.length.message',
            options: { group: 'user' },
          },
          'string.email': {
            message: 'email.base.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'email.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  email: string;

  @ApiProperty({ example: '123456789999', description: '用户电话' })
  @Rule(
    RuleType.string()
      .empty('')
      .trim(true)
      .pattern(
        /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
      )
      .error(
        handleParameterError({
          message: 'tel.base.message',
          options: { group: 'user' },
        })
      )
  )
  tel: string;

  @ApiProperty({ example: '1', description: '用户类型' })
  @Rule(
    RuleType.string()
      .required()
      .max(1)
      .trim(true)
      .valid(...Object.values(UserType))
      .error(
        handleParameterError({
          message: 'type.base.message',
          options: { group: 'user' },
        })
      )
  )
  type: string;

  @ApiProperty({ example: 'Michael', description: '用户真实姓名' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'real_name.length.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'real_name.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  realName: string;

  @ApiProperty({ example: '新的用户', description: '用户介绍' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  description: string;
}

export class CreateUserDTO extends UserDTO {}

export class UpdateUserDTO extends UserDTO {}

export class GetUserListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '组织编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .error(
        handleParameterError({
          message: 'organization_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  organizationIds: string[] | string;

  @ApiProperty({ example: null, description: '公司编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .error(
        handleParameterError({
          message: 'company_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  companyIds: string[] | string;
}
