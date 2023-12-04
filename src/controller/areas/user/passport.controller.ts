import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';
import { ApiBody, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { UserService } from '../../../service/user.service';
import { PassportService } from '../../../service/passport.service';
import {
  LoginDTO,
  RefreshTokenDTO,
} from '../../../dto/areas/user/passport.dto';

@ApiTags(['passport'])
@Controller('/api/user/passport')
export class PassportController {
  @Inject()
  ctx: Context;

  @Inject()
  captchaService: CaptchaService;

  @Inject()
  userService: UserService;

  @Inject()
  passportService: PassportService;

  @Post('/login', { summary: '用户-登录' })
  @ApiBody({ description: '用户登录凭证' })
  async login(@Body() dto: LoginDTO) {
    const user = await this.userService.tryLogin(
      dto.account,
      dto.password,
      dto.captchaId,
      dto.captcha
    );
    const roleCodes = user.userRoleMappings.map(item => item.role.code);
    const accessToken = await this.passportService.generateAccessToken(
      user.id,
      roleCodes,
      dto.checked
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      user.id,
      roleCodes,
      dto.checked
    );
    return {
      id: user.id,
      tenantId: user.tenantId,
      accessToken,
      refreshToken,
    };
  }

  @Get('/refreshToken', { summary: '用户-更新AccessToken' })
  @ApiQuery({ description: 'RefreshToken凭证' })
  async refreshToken(@Query() query: RefreshTokenDTO) {
    const { id, roles, checked } =
      await this.passportService.verifyRefreshToken(query.refreshToken);
    const accessToken = await this.passportService.generateAccessToken(
      id,
      roles,
      checked
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      id,
      roles,
      checked
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('/captcha', { summary: '用户-登录验证码' })
  async getImageCaptcha() {
    const { id, imageBase64 } = await this.captchaService.formula();
    return {
      id,
      imageBase64,
    };
  }
}
