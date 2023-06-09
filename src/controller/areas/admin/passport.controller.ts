import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { LoginDTO } from '../../../dto/areas/admin/passport.dto';
import { Context } from '@midwayjs/koa';
import { AdminService } from '../../../service/admin.service';
import { ApiBody } from '@midwayjs/swagger';
import { PassportService } from '../../../service/passport.service';

@Controller('/api/admin/passport')
export class PassportController {
  @Inject()
  ctx: Context;

  @Inject()
  adminService: AdminService;

  @Inject()
  passportService: PassportService;

  @Post('/login', { summary: '管理员登录' })
  @ApiBody({ description: '管理员登录凭证' })
  async login(@Body() dto: LoginDTO) {
    const admin = await this.adminService.tryLogin(dto.username, dto.password);
    const accessToken = await this.passportService.generateAccessToken(
      admin.id,
      'admin'
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      admin.id,
      'admin'
    );
    return {
      admin,
      accessToken,
      refreshToken,
    };
  }
}
