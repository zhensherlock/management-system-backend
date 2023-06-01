import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Admin } from '../entity/admin.entity';
import { Not, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { encrypt } from '../util';
import { isEmpty } from 'lodash';

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

  async updateAdmin(id: string, admin: Admin) {
    const secret = encrypt(admin.password);
    admin.password = secret.hash;
    admin.salt = secret.salt;
    return await this.updateObject(id, admin);
  }

  async updateAdminPassword(id: string, dto: Admin) {
    const secret = encrypt(dto.password);
    const admin = await this.getObjectById(id);
    admin.password = secret.hash;
    admin.salt = secret.salt;
    return await this.updateObject(id, admin);
  }

  async checkNameExisted(name: string, id?: string) {
    return await this.entityModel.exist({
      where: {
        name,
        ...(isEmpty(id)
          ? {}
          : {
              id: Not(id),
            }),
      },
    });
  }
}
