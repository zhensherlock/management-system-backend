import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ModuleEntity } from '../entity/module.entity';
import { Like, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty, isString, isArray } from 'lodash';

@Provide()
export class ModuleService extends BaseService<ModuleEntity> {
  @InjectEntityModel(ModuleEntity)
  entityModel: Repository<ModuleEntity>;

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
    query.orderBy('module.sequence', 'DESC');
    return await query.leftJoinAndSelect('module.children', 'child').getMany();
  }

  async getTreeList(keyword, roleIds: string[] | string) {
    let moduleRoleMappings = [];
    if (isString(roleIds)) {
      moduleRoleMappings = [{ roleId: roleIds }];
    }
    if (isArray(roleIds)) {
      moduleRoleMappings = (<string[]>roleIds).map(id => ({
        roleId: id,
      }));
    }
    const list = await this.getList({
      where: {
        moduleRoleMappings,
        ...(isEmpty(keyword) ? {} : { name: Like(`%${keyword}%`) }),
      },
      order: {
        sequence: 'DESC',
      },
    });
    const rootModules = list.filter(item => !item.parentId);
    const hierarchicalModules = [];
    for (const rootModule of rootModules) {
      hierarchicalModules.push(this.getModuleTree(rootModule, list));
    }
    return hierarchicalModules;
  }

  private getModuleTree(mdl: ModuleEntity, allModules: ModuleEntity[]) {
    const children = allModules.filter(item => item.parentId === mdl.id);
    if (children.length > 0) {
      mdl.children = children.map(child =>
        this.getModuleTree(child, allModules)
      );
    }
    return mdl;
  }
}
