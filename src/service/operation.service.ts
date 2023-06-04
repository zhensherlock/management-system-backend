import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Operation } from '../entity/operation.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class OperationService extends BaseService<Operation> {
  @InjectEntityModel(Operation)
  entityModel: Repository<Operation>;

  constructor() {
    super();
  }
}
