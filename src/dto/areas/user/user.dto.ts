import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { handleParameterError, handleParameterErrors } from '../../../error';

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

export class CreateUserDTO extends UserDTO {
  @ApiProperty({ example: {}, description: '用户密码' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'password.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'password.required.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'password.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  password: string;
}

export class UpdateUserDTO extends UserDTO {
  @ApiProperty({ example: {}, description: '用户新密码' })
  @Rule(
    RuleType.string()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .error(
        handleParameterError({
          message: 'new_password.base.message',
          options: { group: 'user' },
        })
      )
  )
  new_password: string;

  @ApiProperty({ example: null, description: '组织编号' })
  @Rule(
    RuleType.array()
      .items(RuleType.string().uuid({ separator: false }))
      .error(
        handleParameterError({
          message: 'organization_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  organizationIds: string[];

  @ApiProperty({ example: null, description: '角色编号' })
  @Rule(
    RuleType.array()
      .items(RuleType.string().uuid({ separator: false }))
      .error(
        handleParameterError({
          message: 'role_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  roleIds: string[];
}

export class UpdatePasswordDTO {
  @ApiProperty({ example: {}, description: '用户旧密码' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'old_password.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'old_password.required.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'old_password.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  old_password: string;

  @ApiProperty({ example: {}, description: '用户新密码' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .not(RuleType.ref('old_password'))
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'new_password.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'new_password.required.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'new_password.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  new_password: string;

  @ApiProperty({ example: {}, description: '用户确认新密码' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .valid(RuleType.ref('new_password'))
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'repeat_new_password.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'repeat_new_password.required.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'repeat_new_password.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  repeat_new_password: string;
}
