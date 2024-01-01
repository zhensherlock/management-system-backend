import { Config, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError, IMiddleware } from '@midwayjs/core';
import { PassportService } from '../service/passport.service';
import { AdminService } from '../service/admin.service';
import { PassportType } from '../constant/passport.constant';
import { UserService } from '../service/user.service';
import { MidwayI18nService } from '@midwayjs/i18n';

@Middleware()
export class SecurityMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('app.security')
  securityConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const passportService = await ctx.requestContext.getAsync(
        PassportService
      );
      const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError(
          i18nService.translate('token.required.message', {
            group: 'passport',
          })
        );
      }
      const parts = ctx.get('authorization').trim().split(' ');
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError(
          i18nService.translate('token.base.message', {
            group: 'passport',
          })
        );
      }
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError(
          i18nService.translate('token.base.message', {
            group: 'passport',
          })
        );
      }
      try {
        const adminService = await ctx.requestContext.getAsync(AdminService);
        const userService = await ctx.requestContext.getAsync(UserService);
        const passport = await passportService.verifyAccessToken(token);
        ctx.currentPassport = passport;
        if (passport.roles.includes(PassportType.Admin)) {
          ctx.isAdmin = true;
          const admin = await adminService.getFullObjectById(passport.id);
          if (admin) {
            ctx.currentAdmin = {
              id: admin.id,
              name: admin.name,
              password: admin.password,
              salt: admin.salt,
              email: admin.email || '',
              tel: admin.tel || '',
              realName: admin.realName,
            };
          }
        } else {
          const user = await userService.getFullObjectById(passport.id, {
            relations: [
              'userRoleMappings',
              'userRoleMappings.role',
              'organizationUserMappings',
              'organizationUserMappings.organization',
            ],
          });
          if (user) {
            ctx.currentUser = {
              id: user.id,
              salt: user.salt,
              password: user.password,
              name: user.name,
              email: user.email || '',
              tel: user.tel || '',
              realName: user.realName,
              description: user.description,
              enabled: user.enabled,
              options: user.options,
              type: user.type,
              roles: user.userRoleMappings.map((item: any) => {
                return {
                  name: item.role.name,
                  id: item.role.id,
                };
              }),
              organizations: user.organizationUserMappings.map((item: any) => {
                return {
                  name: item.organization.name,
                  id: item.organization.id,
                  type: item.organization.type,
                  level: item.organization.level,
                };
              }),
            };
          }
        }
        return next();
      } catch (error) {
        if (['TokenExpiredError', 'JsonWebTokenError'].includes(error.name)) {
          throw new httpError.UnauthorizedError(
            i18nService.translate('token.base.message', {
              group: 'passport',
            })
          );
        }
        throw error;
      }
    };
  }

  public match(ctx: Context): boolean {
    const { path } = ctx;
    const { prefix, ignore } = this.securityConfig;
    const exist = ignore.find(item => {
      // return item.match(path);
      return item === path;
    });
    return path.indexOf(prefix) === 0 && !exist;
  }

  public static getName(): string {
    return 'SECURITY';
  }
}
