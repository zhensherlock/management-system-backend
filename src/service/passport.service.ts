import { Inject, Provide } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { RedisService } from '@midwayjs/redis';
import { formatToMS } from '../util';
import { Config } from '@midwayjs/decorator';
import { TokenExpiredError } from 'jsonwebtoken';
import { PassportOptions } from '../interface';

@Provide()
export class PassportService {
  @Inject()
  jwtService: JwtService;

  @Inject()
  redisService: RedisService;

  @Config('jwt')
  jwtConfig;

  async generateAccessToken(id: string, roles: string[], checked: boolean) {
    const accessToken = await this.jwtService.sign({
      id,
      roles,
      checked,
    });
    this.redisService.set(
      `${this.jwtConfig.cacheKeyPrefix}:accessToken:${id}`,
      accessToken,
      'PX',
      formatToMS(
        checked ? this.jwtConfig.rememberExpiresIn : this.jwtConfig.expiresIn
      )
    );
    return accessToken;
  }

  async generateRefreshToken(id: string, roles: string[], checked: boolean) {
    const expiresIn = checked
      ? this.jwtConfig.refreshToken.rememberExpiresIn
      : this.jwtConfig.refreshToken.expiresIn;
    const refreshToken = await this.jwtService.sign(
      {
        id,
        roles,
        type: 'refresh',
      },
      this.jwtConfig.refreshToken.secret,
      {
        expiresIn,
      }
    );
    this.redisService.set(
      `${this.jwtConfig.cacheKeyPrefix}:refreshToken:${id}`,
      refreshToken,
      'PX',
      formatToMS(expiresIn)
    );
    return refreshToken;
  }

  async verifyAccessToken(token: string) {
    await this.jwtService.verify(token, { complete: true });
    const user = (await this.jwtService.decode(token)) as PassportOptions;
    if (
      user &&
      (await this.redisService.exists(
        `${this.jwtConfig.cacheKeyPrefix}:accessToken:${user.id}`
      )) === 1
    ) {
      return user;
    }
    throw new TokenExpiredError('jwt expired', new Date());
  }

  async verifyRefreshToken(token: string) {
    await this.jwtService.verify(token, this.jwtConfig.refreshToken.secret, {
      complete: true,
    });
    const user = (await this.jwtService.decode(token)) as PassportOptions;
    if (
      user &&
      (await this.redisService.exists(
        `${this.jwtConfig.cacheKeyPrefix}:refreshToken:${user.id}`
      )) === 1
    ) {
      return user;
    }
    throw new TokenExpiredError('jwt expired', new Date());
  }
}
