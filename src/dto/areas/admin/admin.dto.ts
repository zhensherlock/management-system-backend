import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { GetListBaseDTO } from '../../base.dto';
import { handleParameterError, handleParameterErrors } from '../../../error';

export class AdminDTO {
  @ApiProperty({ example: 'admin1', description: '管理员登录名' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'admin' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'admin' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'name.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'email.length.message',
            options: { group: 'admin' },
          },
          'string.email': {
            message: 'email.base.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'email.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  email: string;

  @ApiProperty({ example: '123456789999', description: '管理员电话' })
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
          options: { group: 'admin' },
        })
      )
  )
  tel: string;

  @ApiProperty({ example: 'Michael', description: '管理员真实姓名' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'real_name.length.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'real_name.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: true, description: '管理员是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'enabled.base.message',
        options: { group: 'admin' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '管理员扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
        options: { group: 'admin' },
      })
    )
  )
  options: object;
}

export class CreateAdminDTO extends AdminDTO {
  @ApiProperty({ example: '', description: '管理员密码' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'password.required.message',
            options: { group: 'admin' },
          },
          'any.required': {
            message: 'password.required.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'password.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  password: string;
}

export class UpdateAdminDTO extends AdminDTO {
  @ApiProperty({ example: '', description: '管理员新密码' })
  @Rule(
    RuleType.string()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .error(
        handleParameterError({
          message: 'new_password.base.message',
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

  @ApiProperty({ example: '', description: '管理员旧密码' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'old_password.required.message',
            options: { group: 'admin' },
          },
          'any.required': {
            message: 'old_password.required.message',
            options: { group: 'admin' },
          },
          '*': {
            message: 'old_password.base.message',
            options: { group: 'admin' },
          },
        })
      )
  )
  old_password: string;

  @ApiProperty({ example: '', description: '管理员新密码' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .not(RuleType.ref('old_password'))
  )
  new_password: string;

  @ApiProperty({ example: '', description: '管理员确认新密码' })
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
