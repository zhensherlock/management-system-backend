import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterErrors } from '../../../error';

export class LoginDTO {
  @ApiProperty({ example: 'user', description: '用户名' })
  @Rule(
    RuleType.string()
      .required()
      .max(100)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'passport' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'passport' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  username: string;

  @ApiProperty({ example: '123456', description: '密码' })
  @Rule(
    RuleType.string()
      .required()
      .max(100)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'i18n:password.required.message',
            options: { group: 'passport' },
          },
          'any.required': {
            message: 'i18n:password.required.message',
            options: { group: 'passport' },
          },
          '*': {
            message: 'i18n:password.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  password: string;
}
