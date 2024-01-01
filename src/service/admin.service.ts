import { ILogger, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { AdminEntity } from '../entity/admin.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { encrypt } from '../util';
import { CaptchaError, CommonError } from '../error';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';

@Provide()
export class AdminService extends BaseService<AdminEntity> {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  @Inject()
  captchaService: CaptchaService;

  @InjectEntityModel(AdminEntity)
  entityModel: Repository<AdminEntity>;

  fullSelects = [
    'id',
    'name',
    'email',
    'tel',
    'password',
    'salt',
    'realName',
    'description',
    'enabled',
    'options',
  ];

  constructor() {
    super();
  }

  async tryLogin(
    account: string,
    password: string,
    captchaId: string,
    captcha: string
  ) {
    if (
      this.checkPasswordErrorNumber()
        ? !(await this.captchaService.check(captchaId, captcha))
        : false
    ) {
      throw new CaptchaError('captcha.base.message', {
        group: 'passport',
      });
    }
    const mdl = await this.getOneObject({
      select: [
        'id',
        'password',
        'salt',
        'realName',
        'description',
        'options',
        'email',
        'tel',
        'enabled',
      ],
      where: {
        name: account,
      },
    });
    if (!mdl) {
      throw new CommonError('user.nonexistence.message', {
        group: 'passport',
      });
    }
    if (!mdl.enabled) {
      throw new CommonError('user.disabled.message', {
        group: 'passport',
      });
    }
    if (mdl.password !== encrypt(password, mdl.salt).hash) {
      this.addPasswordErrorNumber();
      throw new CommonError('user.error.password.message', {
        group: 'passport',
      });
    }
    return mdl;
  }

  addPasswordErrorNumber(count = 1) {
    const passwordErrorNumber = this.ctx.session.passwordErrorNumber || 0;
    this.ctx.session.passwordErrorNumber = passwordErrorNumber + count;
  }

  checkPasswordErrorNumber() {
    return this.ctx.session.passwordErrorNumber >= 5;
  }
}
