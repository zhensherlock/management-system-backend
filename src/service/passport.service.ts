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

  async generateAccessToken(userId, userType) {
    const accessToken = await this.jwtService.sign({
      userId,
      userType,
    });
    this.redisService.set(
      `${this.jwtConfig.cacheKeyPrefix}:accessToken:${userId}`,
      accessToken,
      'PX',
      formatToMS(this.jwtConfig.expiresIn)
    );
    return accessToken;
  }

  async generateRefreshToken(userId, userType) {
    const refreshToken = await this.jwtService.sign(
      {
        userId,
        userType,
        type: 'refresh',
      },
      this.jwtConfig.refreshToken.secret,
      {
        expiresIn: this.jwtConfig.refreshToken.expiresIn,
      }
    );
    this.redisService.set(
      `${this.jwtConfig.cacheKeyPrefix}:refreshToken:${userId}`,
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
    const user = (await this.jwtService.decode(token)) as any;
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
}
