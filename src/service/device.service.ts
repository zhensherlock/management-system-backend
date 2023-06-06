import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Device } from '../entity/device.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class DeviceService extends BaseService<Device> {
  @InjectEntityModel(Device)
  entityModel: Repository<Device>;

  constructor() {
    super();
  }
}
