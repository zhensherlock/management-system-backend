import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ModuleEntity } from '../entity/module.entity';
import { Like, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty, isString, isArray, minBy } from 'lodash';

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

  async getTreeList(keyword: string) {
    const allModules = await this.getList({
      order: {
        sequence: 'ASC',
      },
      relations: ['operations'],
    });

    const filteredModules = allModules.filter(item =>
      isEmpty(keyword) ? true : item.name.includes(keyword)
    );
    let list = filteredModules;
    if (filteredModules.length === 0) {
      return { list: [], count: 0 };
    }
    if (!isEmpty(keyword) && filteredModules.length > 0) {
      const associatedModules = new Set([]);
      filteredModules.forEach(item => {
        this.addModuleParentsAndChildren(item, allModules, associatedModules);
      });
      list = Array.from(associatedModules);
    }
    const topLevel = minBy(list, 'level').level;
    const rootModules = list.filter(item => item.level === topLevel);
    const hierarchicalModules = [];
    for (const rootModule of rootModules) {
      hierarchicalModules.push(this.getModuleTree(rootModule, list));
    }
    return {
      list: hierarchicalModules,
      count: list.length,
    };
  }

  private addModuleParentsAndChildren(
    mdl: ModuleEntity,
    allModules: ModuleEntity[],
    associatedModules: Set<ModuleEntity>
  ) {
    // 添加所有父级模块
    this.addModuleParents(mdl, allModules, associatedModules);

    // 添加所有子集模块
    this.addModuleChildren(mdl, allModules, associatedModules);
  }

  private addModuleParents(
    mdl: ModuleEntity,
    allModules: ModuleEntity[],
    parents: Set<ModuleEntity>
  ) {
    parents.add(mdl);
    if (!mdl.parentId) {
      return parents;
    } else {
      const parent = allModules.find(item => item.id === mdl.parentId);
      if (parent) {
        return this.addModuleParents(parent, allModules, parents);
      }
    }
  }

  private addModuleChildren(
    mdl: ModuleEntity,
    allModules: ModuleEntity[],
    parents: Set<ModuleEntity>
  ) {
    const children = allModules.filter(item => item.parentId === mdl.id);
    children.forEach(item => {
      parents.add(item);
      this.addModuleChildren(item, allModules, parents);
    });
  }

  async getTreeList1(keyword: string, roleIds: string[] | string) {
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
