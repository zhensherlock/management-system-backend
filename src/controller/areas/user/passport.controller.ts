import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import {
  LoginDTO,
  RefreshTokenDTO,
} from '../../../dto/areas/user/passport.dto';
import { Context } from '@midwayjs/koa';
import { UserService } from '../../../service/user.service';
import { ApiBody, ApiQuery, ApiTags } from '@midwayjs/swagger';
import { PassportService } from '../../../service/passport.service';
import { PassportType } from '../../../constant/passport.constant';

@ApiTags(['passport'])
@Controller('/api/user/passport')
export class PassportController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  passportService: PassportService;

  @Post('/login', { summary: '用户-登录' })
  @ApiBody({ description: '用户登录凭证' })
  async login(@Body() dto: LoginDTO) {
    const user = await this.userService.tryLogin(dto.username, dto.password);
    const accessToken = await this.passportService.generateAccessToken(
      user.id,
      PassportType.User
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      user.id,
      PassportType.User
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('/refreshToken', { summary: '用户-更新AccessToken' })
  @ApiQuery({ description: 'RefreshToken凭证' })
  async refreshToken(@Query() query: RefreshTokenDTO) {
    const { passportId, passportType } =
      await this.passportService.verifyRefreshToken(query.refreshToken);
    const accessToken = await this.passportService.generateAccessToken(
      passportId,
      passportType
    );
    const refreshToken = await this.passportService.generateRefreshToken(
      passportId,
      passportType
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
