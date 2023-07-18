import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import {
  LoginDTO,
  RefreshTokenDTO,
} from '../../../dto/areas/admin/passport.dto';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';
import { AdminService } from '../../../service/admin.service';
import { ApiBody, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { PassportService } from '../../../service/passport.service';
import { PassportType } from '../../../constant/passport.constant';

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
    const admin = await this.adminService.tryLogin(dto.username, dto.password);
    const accessToken = await this.passportService.generateAccessToken(
      admin.id,
      [PassportType.Admin]
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      admin.id,
      [PassportType.Admin]
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('/refreshToken', { summary: '管理员-更新AccessToken' })
  @ApiQuery({ description: 'RefreshToken凭证' })
  async refreshToken(@Query() query: RefreshTokenDTO) {
    const { id, roles } = await this.passportService.verifyRefreshToken(
      query.refreshToken
    );
    const accessToken = await this.passportService.generateAccessToken(
      id,
      roles
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      id,
      roles
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
