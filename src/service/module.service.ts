import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Module } from '../entity/module.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class ModuleService extends BaseService<Module> {
  @InjectEntityModel(Module)
  entityModel: Repository<Module>;

  constructor() {
    super();
  }
}
