import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ModuleEntity } from '../entity/module.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty, minBy, intersectionWith } from 'lodash';
import { ModuleRoleMappingService } from './module_role_mapping.service';
import { ModuleRoleMappingEntity } from '../entity/module_role_mapping.entity';

@Provide()
export class ModuleService extends BaseService<ModuleEntity> {
  @InjectEntityModel(ModuleEntity)
  entityModel: Repository<ModuleEntity>;

  @Inject()
  moduleRoleMappingService: ModuleRoleMappingService;

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

  async getAllEnabledList() {
    return await this.getList({
      where: {
        enabled: true,
      },
      order: {
        sequence: 'ASC',
      },
      relations: ['operations'],
    });
  }

  async getAllModuleRoleMappingList() {
    return await this.moduleRoleMappingService.getList();
  }

  async getModuleTreeList(keyword: string, roleIds: string[] = []) {
    const allModules = await this.getAllEnabledList();
    let allModuleRoleMappingList: ModuleRoleMappingEntity[] = [];
    if (roleIds.length > 0) {
      allModuleRoleMappingList = await this.getAllModuleRoleMappingList();
    }

    const filteredModules = allModules.filter(module => {
      let hasPermission = true;
      if (roleIds.length > 0) {
        const currentModuleAllRoleMappings = allModuleRoleMappingList.filter(
          item => item.moduleId === module.id
        );
        const currentMappings = intersectionWith(
          currentModuleAllRoleMappings,
          roleIds,
          (a, b) => a.roleId === b
        );
        hasPermission = currentMappings.length > 0;
        if (hasPermission) {
          module.operations = module.operations.filter(item =>
            (<any[]>currentMappings[0].operationOptions)
              .map(item => item.id)
              .includes(item.id)
          );
        }
      }
      return (
        hasPermission &&
        (isEmpty(keyword) ? true : module.name.includes(keyword))
      );
    });
    let list = filteredModules;
    if (filteredModules.length === 0) {
      return { list: [], count: 0 };
    }
    if (filteredModules.length !== allModules.length) {
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
