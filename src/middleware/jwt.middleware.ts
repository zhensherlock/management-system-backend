import { Middleware } from '@midwayjs/core';
import { PassportMiddleware, AuthenticateOptions } from '@midwayjs/passport';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { Config } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

@Middleware()
export class JwtPassportMiddleware extends PassportMiddleware(JwtStrategy) {
  @Config('app.security')
  securityConfig;

  getAuthenticateOptions(): Promise<AuthenticateOptions> | AuthenticateOptions {
    return {};
  }

  public match(ctx: Context): boolean {
    const { path } = ctx;
    const { prefix, ignore } = this.securityConfig;
    const exist = ignore.find(item => {
      return item === path;
    });
    return path.indexOf(prefix) === 0 && !exist;
  }

  public static getName(): string {
    return 'JWT-PASSPORT';
  }
}
