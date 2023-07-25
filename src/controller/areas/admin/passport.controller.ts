import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';
import { ApiBody, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { AdminService } from '../../../service/admin.service';
import { PassportService } from '../../../service/passport.service';
import { PassportType } from '../../../constant/passport.constant';
import {
  LoginDTO,
  RefreshTokenDTO,
} from '../../../dto/areas/admin/passport.dto';

@ApiTags(['passport'])
@Controller('/api/admin/passport')
export class PassportController {
  @Inject()
  ctx: Context;

  @Inject()
  captchaService: CaptchaService;

  @Inject()
  adminService: AdminService;

  @Inject()
  passportService: PassportService;

  @Post('/login', { summary: '管理员-登录' })
  @ApiBody({ description: '管理员登录凭证' })
  async login(@Body() dto: LoginDTO) {
    const admin = await this.adminService.tryLogin(
      dto.username,
      dto.password,
      dto.captchaId,
      dto.captcha
    );
    const accessToken = await this.passportService.generateAccessToken(
      admin.id,
      [PassportType.Admin],
      dto.checked
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      admin.id,
      [PassportType.Admin],
      dto.checked
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('/refreshToken', { summary: '管理员-更新AccessToken' })
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

  @Get('/captcha', { summary: '管理员-登录验证码' })
  async getImageCaptcha() {
    const { id, imageBase64 } = await this.captchaService.formula();
    return {
      id,
      imageBase64,
    };
  }
}
