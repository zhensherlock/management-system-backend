import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { OrganizationUserMappingEntity } from '../entity/organization_user_mapping.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class OrganizationUserMappingService extends BaseService<OrganizationUserMappingEntity> {
  @InjectEntityModel(OrganizationUserMappingEntity)
  entityModel: Repository<OrganizationUserMappingEntity>;

  constructor() {
    super();
  }
}
