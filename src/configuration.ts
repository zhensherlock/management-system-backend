import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as redis from '@midwayjs/redis';
import * as jwt from '@midwayjs/jwt';
import * as upload from '@midwayjs/upload';
import * as i18n from '@midwayjs/i18n';
import * as orm from '@midwayjs/typeorm';
import * as swagger from '@midwayjs/swagger';
import * as passport from '@midwayjs/passport';
import { join } from 'path';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { ValidateErrorFilter } from './filter/validate.error.filter';
import { TranslateValidateErrorFilter } from './filter/translate.validate.filter';
import * as dotenv from 'dotenv';
import { ParameterErrorFilter } from './filter/parameter.error.filter';
import { CommonErrorFilter } from './filter/common.error.filter';
import { CommonWarningFilter } from './filter/common.warning.filter';
import { FormatMiddleware } from './middleware/format.middleware';
// import { JwtPassportMiddleware } from './middleware/jwt.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';
import { AuthGuard } from './guard/auth.guard';

dotenv.config();

@Configuration({
  imports: [
    koa,
    redis,
    validate,
    jwt,
    upload,
    i18n,
    orm,
    swagger,
    passport,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([
      ReportMiddleware,
      FormatMiddleware,
      // JwtPassportMiddleware,
      SecurityMiddleware,
    ]);
    // add guard
    this.app.useGuard([AuthGuard]);
    // add filter
    this.app.useFilter([
      NotFoundFilter,
      CommonErrorFilter,
      CommonWarningFilter,
      ParameterErrorFilter,
      ValidateErrorFilter,
      TranslateValidateErrorFilter,
      DefaultErrorFilter,
    ]);
  }
}
