import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { UserRoleMappingEntity } from '../entity/user_role_mapping.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class UserRoleMappingService extends BaseService<UserRoleMappingEntity> {
  @InjectEntityModel(UserRoleMappingEntity)
  entityModel: Repository<UserRoleMappingEntity>;

  constructor() {
    super();
  }
}
