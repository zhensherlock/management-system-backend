import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { EmployeeEntity } from '../entity/employee.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class EmployeeService extends BaseService<EmployeeEntity> {
  @InjectEntityModel(EmployeeEntity)
  entityModel: Repository<EmployeeEntity>;

  constructor() {
    super();
  }
}
