import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ApplyModificationEntity } from '../entity/apply_modification.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class ApplyModificationService extends BaseService<ApplyModificationEntity> {
  @InjectEntityModel(ApplyModificationEntity)
  entityModel: Repository<ApplyModificationEntity>;

  constructor() {
    super();
  }
}
