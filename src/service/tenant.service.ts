import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { TenantEntity } from '../entity/tenant.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class TenantService extends BaseService<TenantEntity> {
  @InjectEntityModel(TenantEntity)
  entityModel: Repository<TenantEntity>;

  constructor() {
    super();
  }
}
