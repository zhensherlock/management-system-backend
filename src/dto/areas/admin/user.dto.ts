import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { GetListBaseDTO } from '../../base.dto';
import { handleError, handleErrors } from '../../../error';
import { UserType } from '../../../constant';

export class UserDTO {
  @ApiProperty({ example: 'user1', description: '用户登录名' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'user' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'i18n:name.base.message',
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
        handleErrors({
          'string.max': {
            message: 'i18n:email.length.message',
            options: { group: 'user' },
          },
          'string.email': {
            message: 'i18n:email.base.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'i18n:email.base.message',
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
        handleError({
          message: 'i18n:tel.base.message',
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
        handleError({
          message: 'i18n:type.base.message',
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
        handleErrors({
          'string.max': {
            message: 'i18n:real_name.length.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'i18n:real_name.base.message',
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
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'user' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: true, description: '用户是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:enabled.base.message',
        options: { group: 'user' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '用户扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
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
        handleError({
          message: 'i18n:user_id.base.message',
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
        handleErrors({
          'string.empty': {
            message: 'i18n:password.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'i18n:password.required.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'i18n:password.base.message',
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
        handleError({
          message: 'i18n:new_password.base.message',
          options: { group: 'user' },
        })
      )
  )
  new_password: string;
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
        handleErrors({
          'string.empty': {
            message: 'i18n:old_password.required.message',
            options: { group: 'user' },
          },
          'any.required': {
            message: 'i18n:old_password.required.message',
            options: { group: 'user' },
          },
          '*': {
            message: 'i18n:old_password.base.message',
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
        handleError({
          message: 'i18n:type.base.message',
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
        handleError({
          message: 'i18n:user_id.base.message',
          options: { group: 'user' },
        })
      )
  )
  tenantId: string;
}
