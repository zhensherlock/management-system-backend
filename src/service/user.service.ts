import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  entityModel: Repository<UserEntity>;

  constructor() {
    super();
  }
}
