import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Tenant } from '../entity/tenant.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class TenantService extends BaseService<Tenant> {
  @InjectEntityModel(Tenant)
  entityModel: Repository<Tenant>;

  constructor() {
    super();
  }
}
