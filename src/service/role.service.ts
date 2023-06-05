import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Role } from '../entity/role.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class RoleService extends BaseService<Role> {
  @InjectEntityModel(Role)
  entityModel: Repository<Role>;

  constructor() {
    super();
  }
}
