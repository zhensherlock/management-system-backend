import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ModuleRoleMappingEntity } from '../entity/module_role_mapping.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class ModuleRoleMappingService extends BaseService<ModuleRoleMappingEntity> {
  @InjectEntityModel(ModuleRoleMappingEntity)
  entityModel: Repository<ModuleRoleMappingEntity>;

  constructor() {
    super();
  }
}
