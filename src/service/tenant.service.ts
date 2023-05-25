import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Tenant } from '../entity/tenant.entity';
import { Repository } from 'typeorm';
import type {
  // ITenantFindOneByIdOptions,
  ISaveTenantOptions,
} from '../interface';
import { BaseService } from './base.service';

@Provide()
export class TenantService extends BaseService<Tenant> {
  @InjectEntityModel(Tenant)
  entityModel: Repository<Tenant>;

  constructor() {
    super();
  }

  async save(options: ISaveTenantOptions) {
    const tenant = new Tenant();
    tenant.name = options.name;
    tenant.description = options.description;
    tenant.address = options.address;
    tenant.country = options.country;
    tenant.province = options.province;
    tenant.city = options.city;
    tenant.latitude = options.latitude;
    tenant.longitude = options.longitude;
    tenant.enabled = options.enabled;
    const tenantResult = await this.entityModel.save(tenant);
    console.log('tenant id = ', tenantResult.id);
  }
}
