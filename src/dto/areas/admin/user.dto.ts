import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { GetListBaseDTO } from '../../base.dto';
import { handleParameterError, handleParameterErrors } from '../../../error';
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

  @ApiProperty({ example: true, description: '用户是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'enabled.base.message',
        options: { group: 'user' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '用户扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
        options: { group: 'user' },
      })
    )
  )
  options: object;

  @ApiProperty({ example: null, description: '租户编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'tenant_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  tenantId: string;
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
}

export class UpdateUserPasswordDTO {
  // @ApiProperty({
  //   example: '50e743d998244f81a46db4acc6aa2d8d',
  //   description: '用户编号',
  // })
  // @Rule(RuleType.string().max(36).required().trim(true))
  // id: string;

  @ApiProperty({ example: {}, description: '用户旧密码' })
  @Rule(
    RuleType.string()
      .max(100)
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
      .max(100)
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .not(RuleType.ref('old_password'))
  )
  new_password: string;

  @ApiProperty({ example: {}, description: '用户确认新密码' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .valid(RuleType.ref('new_password'))
  )
  repeat_new_password: string;
}

export class GetUserListDTO extends GetListBaseDTO {
  @ApiProperty({ example: '1', description: '用户类型' })
  @Rule(
    RuleType.string()
      .max(1)
      .trim(true)
      .empty('')
      .valid(...Object.values(UserType))
      .error(
        handleParameterError({
          message: 'type.base.message',
          options: { group: 'user' },
        })
      )
  )
  type: string;

  @ApiProperty({ example: null, description: '租户编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'tenant_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  tenantId: string;

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
}
