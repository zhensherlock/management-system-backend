import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Admin } from '../entity/admin.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class AdminService extends BaseService<Admin> {
  @InjectEntityModel(Admin)
  entityModel: Repository<Admin>;

  constructor() {
    super();
  }
}
