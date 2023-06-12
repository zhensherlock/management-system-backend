import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class RoleService extends BaseService<RoleEntity> {
  @InjectEntityModel(RoleEntity)
  entityModel: Repository<RoleEntity>;

  constructor() {
    super();
  }
}
