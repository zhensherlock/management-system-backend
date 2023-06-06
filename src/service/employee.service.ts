import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Employee } from '../entity/employee.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class EmployeeService extends BaseService<Employee> {
  @InjectEntityModel(Employee)
  entityModel: Repository<Employee>;

  constructor() {
    super();
  }
}
