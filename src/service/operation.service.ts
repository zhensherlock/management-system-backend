import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { OperationEntity } from '../entity/operation.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class OperationService extends BaseService<OperationEntity> {
  @InjectEntityModel(OperationEntity)
  entityModel: Repository<OperationEntity>;

  constructor() {
    super();
  }
}
