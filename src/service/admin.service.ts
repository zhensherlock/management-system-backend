import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Admin } from '../entity/admin.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { encrypt } from '../util';

@Provide()
export class AdminService extends BaseService<Admin> {
  @InjectEntityModel(Admin)
  entityModel: Repository<Admin>;

  constructor() {
    super();
  }

  async createAdmin(admin: Admin) {
    const secret = encrypt(admin.password);
    admin.password = secret.hash;
    admin.salt = secret.salt;
    return await this.createObject(admin);
  }

  generatePassword(password) {
    encrypt(password);
  }

  checkPassword() {
  }
}
