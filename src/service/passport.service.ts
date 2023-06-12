import { Inject, Provide } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { RedisService } from '@midwayjs/redis';
import { formatToMS } from '../util';
import { Config } from '@midwayjs/decorator';
import { TokenExpiredError } from 'jsonwebtoken';

@Provide()
export class PassportService {
  @Inject()
  jwtService: JwtService;

  @Inject()
  redisService: RedisService;

  @Config('jwt')
  jwtConfig;

  async generateAccessToken(passportId, passportType) {
    const accessToken = await this.jwtService.sign({
      passportId,
      passportType,
    });
    this.redisService.set(
      `${this.jwtConfig.cacheKeyPrefix}:accessToken:${passportId}`,
      accessToken,
      'PX',
      formatToMS(this.jwtConfig.expiresIn)
    );
    return accessToken;
  }

  async generateRefreshToken(passportId, passportType) {
    const refreshToken = await this.jwtService.sign(
      {
        passportId,
        passportType,
        type: 'refresh',
      },
      this.jwtConfig.refreshToken.secret,
      {
        expiresIn: this.jwtConfig.refreshToken.expiresIn,
      }
    );
    this.redisService.set(
      `${this.jwtConfig.cacheKeyPrefix}:refreshToken:${passportId}`,
      refreshToken,
      'PX',
      formatToMS(this.jwtConfig.refreshToken.expiresIn)
    );
    return refreshToken;
  }

  async verifyAccessToken(token: string) {
    await this.jwtService.verify(token, { complete: true });
    const user = (await this.jwtService.decode(token)) as any;
    if (
      user &&
      (await this.redisService.exists(
        `${this.jwtConfig.cacheKeyPrefix}:accessToken:${user.passportId}`
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
    const user = (await this.jwtService.decode(token)) as any;
    if (
      user &&
      (await this.redisService.exists(
        `${this.jwtConfig.cacheKeyPrefix}:refreshToken:${user.passportId}`
      )) === 1
    ) {
      return user;
    }
    throw new TokenExpiredError('jwt expired', new Date());
  }
}
