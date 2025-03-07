import { CustomStrategy, PassportStrategy } from '@midwayjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Config } from '@midwayjs/core';
// import { PassportType } from '../constant/passport.constant';
import { Inject } from '@midwayjs/decorator';
import { PassportService } from '../service/passport.service';
import { AdminService } from '../service/admin.service';
import { UserService } from '../service/user.service';

@CustomStrategy()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Config('jwt')
  jwtConfig;

  @Inject()
  passportService: PassportService;

  @Inject()
  adminService: AdminService;

  @Inject()
  userService: UserService;

  async validate(payload) {
    console.log('payload' + payload);
    // const { passportId, passportType } =
    //   await this.passportService.verifyAccessToken(token);
    // if (passportType === PassportType.Admin) {
    //   const admin = await this.adminService.getObjectById(passportId);
    //   if (admin) {
    //     ctx.currentAdmin = admin;
    //   }
    // } else {
    //   const user = await this.userService.getObjectById(passportId);
    //   if (user) {
    //     ctx.currentUser = user;
    //   }
    // }
    return payload;
  }

  getStrategyOptions(): any {
    return {
      secretOrKey: this.jwtConfig.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
  }
}
