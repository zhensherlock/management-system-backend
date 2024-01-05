import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { WorkOrderEntity } from '../entity/work_order.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class WorkOrderService extends BaseService<WorkOrderEntity> {
  @InjectEntityModel(WorkOrderEntity)
  entityModel: Repository<WorkOrderEntity>;

  constructor() {
    super();
  }
}
