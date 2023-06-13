import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class DeviceService extends BaseService<DeviceEntity> {
  @InjectEntityModel(DeviceEntity)
  entityModel: Repository<DeviceEntity>;

  constructor() {
    super();
  }
}
