import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Organization } from '../entity/organization.entity';
import { Like, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty } from 'lodash';

@Provide()
export class OrganizationService extends BaseService<Organization> {
  @InjectEntityModel(Organization)
  entityModel: Repository<Organization>;

  constructor() {
    super();
  }

  async getTreeListByJoin(keyword) {
    const query = this.entityModel
      .createQueryBuilder('organization')
      .where('organization.parent_id IS NULL');
    if (!isEmpty(keyword)) {
      query.andWhere('organization.name LIKE :name', { name: `%${keyword}%` });
    }
    return await query
      .leftJoinAndSelect('organization.children', 'child')
      .getMany();
  }

  async getTreeList(keyword) {
    const list = await this.getList({
      where: {
        ...(isEmpty(keyword) ? {} : { name: Like(`%${keyword}%`) }),
      },
    });
    const rootOrganizations = list.filter(item => !item.parentId);
    const hierarchicalOrganizations = [];
    for (const rootOrganization of rootOrganizations) {
      hierarchicalOrganizations.push(
        this.getOrganizationTree(rootOrganization, list)
      );
    }
    return hierarchicalOrganizations;
  }

  private getOrganizationTree(
    mdl: Organization,
    allOrganizations: Organization[]
  ) {
    const children = allOrganizations.filter(item => item.parentId === mdl.id);
    if (children.length > 0) {
      mdl.children = children.map(child =>
        this.getOrganizationTree(child, allOrganizations)
      );
    }
    return mdl;
  }
}
