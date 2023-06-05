import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Module } from '../entity/module.entity';
import { Like, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty } from 'lodash';

@Provide()
export class ModuleService extends BaseService<Module> {
  @InjectEntityModel(Module)
  entityModel: Repository<Module>;

  constructor() {
    super();
  }

  async getTreeListByJoin(keyword) {
    const query = this.entityModel
      .createQueryBuilder('module')
      .where('module.parent_id IS NULL');
    if (!isEmpty(keyword)) {
      query.andWhere('module.name LIKE :name', { name: `%${keyword}%` });
    }
    return await query.leftJoinAndSelect('module.children', 'child').getMany();
  }

  async getTreeList(keyword) {
    const list = await this.getList({
      where: {
        ...(isEmpty(keyword) ? {} : { name: Like(`%${keyword}%`) }),
      },
    });
    const rootModules = list.filter(item => !item.parentId);
    const hierarchicalModules = [];
    for (const rootModule of rootModules) {
      hierarchicalModules.push(this.getModuleTree(rootModule, list));
    }
    return hierarchicalModules;
  }

  private getModuleTree(mdl: Module, allModules: Module[]) {
    const children = allModules.filter(item => item.parentId === item.id);
    if (children.length > 0) {
      mdl.children = children.map(child =>
        this.getModuleTree(child, allModules)
      );
    }
    return mdl;
  }
}
