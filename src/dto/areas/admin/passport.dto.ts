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
            message: 'name.required.message',
            options: { group: 'passport' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'passport' },
          },
          '*': {
            message: 'name.base.message',
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
            message: 'password.required.message',
            options: { group: 'passport' },
          },
          'any.required': {
            message: 'password.required.message',
            options: { group: 'passport' },
          },
          '*': {
            message: 'password.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  password: string;

  @ApiProperty({ example: '', description: '验证码' })
  @Rule(
    RuleType.string()
      .max(100)
      .trim(true)
      .error(
        handleParameterErrors({
          '*': {
            message: 'password.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  captcha: string;
}

export class RefreshTokenDTO {
  @ApiProperty({ example: '', description: 'RefreshToken' })
  @Rule(
    RuleType.string()
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'refresh_token.required.message',
            options: { group: 'passport' },
          },
          'any.required': {
            message: 'refresh_token.required.message',
            options: { group: 'passport' },
          },
          '*': {
            message: 'refresh_token.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  refreshToken: string;
}
