import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Tenant } from '../entity/tenant.entity';
import { Not, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty } from 'lodash';

@Provide()
export class TenantService extends BaseService<Tenant> {
  @InjectEntityModel(Tenant)
  entityModel: Repository<Tenant>;

  constructor() {
    super();
  }

  async checkNameExisted(name: string, id?: string) {
    return await this.entityModel.exist({
      where: {
        name,
        ...(isEmpty(id) ? {} : { id: Not(id) }),
      },
    });
  }
}
