import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { GetListBaseDTO } from '../../base.dto';
import { handleError, handleErrors } from '../../../error';

export class AdminDTO {
  @ApiProperty({ example: 'admin1', description: '管理员登录名' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'admin' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'admin' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'admin' },
          },
        })
      )
    // .external(isExistSameName, '校验用户名是否重复')
  )
  name: string;

  @ApiProperty({ example: 'admin1@hy.com', description: '管理员邮箱' })
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
            options: { group: 'admin' },
          },
          'string.email': {
            message: 'i18n:email.base.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'i18n:email.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  email: string;

  @ApiProperty({ example: 'Michael', description: '管理员真实姓名' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:real_name.length.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'i18n:real_name.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  realName: string;

  @ApiProperty({ example: '新的管理员', description: '管理员介绍' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: true, description: '管理员是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:enabled.base.message',
        options: { group: 'admin' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '管理员扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'admin' },
      })
    )
  )
  options: object;
}

export class CreateAdminDTO extends AdminDTO {
  @ApiProperty({ example: {}, description: '管理员密码' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:password.required.message',
            options: { group: 'admin' },
          },
          'any.required': {
            message: 'i18n:password.required.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'i18n:password.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  password: string;
}

export class UpdateAdminDTO extends AdminDTO {
  @ApiProperty({ example: {}, description: '管理员新密码' })
  @Rule(
    RuleType.string()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .error(
        handleError({
          message: 'i18n:new_password.base.message',
          options: { group: 'admin' },
        })
      )
  )
  new_password: string;
}

export class UpdateAdminPasswordDTO {
  // @ApiProperty({
  //   example: '50e743d998244f81a46db4acc6aa2d8d',
  //   description: '管理员编号',
  // })
  // @Rule(RuleType.string().max(36).required().trim(true))
  // id: string;

  @ApiProperty({ example: {}, description: '管理员旧密码' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:old_password.required.message',
            options: { group: 'admin' },
          },
          'any.required': {
            message: 'i18n:old_password.required.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'i18n:old_password.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  old_password: string;

  @ApiProperty({ example: {}, description: '管理员新密码' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .not(RuleType.ref('old_password'))
  )
  new_password: string;

  @ApiProperty({ example: {}, description: '管理员确认新密码' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .valid(RuleType.ref('new_password'))
  )
  repeat_new_password: string;
}

export class GetAdminListDTO extends GetListBaseDTO {}
