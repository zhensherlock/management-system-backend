import { ILogger, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Admin } from '../entity/admin.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { encrypt } from '../util';
import { CommonError } from '../error';

@Provide()
export class AdminService extends BaseService<Admin> {
  @Inject()
  logger: ILogger;

  @InjectEntityModel(Admin)
  entityModel: Repository<Admin>;

  constructor() {
    super();
  }

  async tryLogin(name: string, password: string) {
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
        name,
      },
    });
    if (!mdl) {
      throw new CommonError('i18n:user.nonexistence.message', {
        group: 'passport',
      });
    }
    if (!mdl.enabled) {
      throw new CommonError('i18n:user.disabled.message', {
        group: 'passport',
      });
    }
    if (mdl.password !== encrypt(password, mdl.salt).hash) {
      throw new CommonError('i18n:user.error.password.message', {
        group: 'passport',
      });
    }
    return mdl;
  }
}
