import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterErrors } from '../../../error';

export class LoginDTO {
  @ApiProperty({ example: 'user', description: '账号' })
  @Rule(
    RuleType.string()
      .required()
      .max(100)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'account.required.message',
            options: { group: 'passport' },
          },
          'any.required': {
            message: 'account.required.message',
            options: { group: 'passport' },
          },
          '*': {
            message: 'account.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  account: string;

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
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          '*': {
            message: 'captcha.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  captcha: string;

  @ApiProperty({ example: '', description: '验证码编号' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          '*': {
            message: 'captcha.base.message',
            options: { group: 'passport' },
          },
        })
      )
  )
  captchaId: string;

  @ApiProperty({ example: false, description: '记住账号' })
  @Rule(RuleType.boolean())
  checked: boolean;
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
