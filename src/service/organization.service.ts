import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { OrganizationEntity } from '../entity/organization.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty, isNull, minBy } from 'lodash';
import ExcelJS from 'exceljs';
import { OrganizationType } from '../constant';

@Provide()
export class OrganizationService extends BaseService<OrganizationEntity> {
  @InjectEntityModel(OrganizationEntity)
  entityModel: Repository<OrganizationEntity>;

  constructor() {
    super();
  }

  async checkNameExisted(name: string, id?: string) {
    return await this.entityModel.exist({
      where: {
        name,
        ...(isEmpty(id) ? {} : { id: Not(id) }),
      },
    });
  }

  async getTreeListByJoin(tenantId, type, keyword) {
    const query = this.entityModel
      .createQueryBuilder('organization')
      .where('organization.parent_id IS NULL')
      .andWhere('organization.tenant_id = :tenantId', { tenantId })
      .andWhere('organization.type = :type', { type });
    if (!isEmpty(keyword)) {
      query.andWhere('organization.name LIKE :name', { name: `%${keyword}%` });
    }
    return await query
      .leftJoinAndSelect('organization.children', 'child')
      .getMany();
  }

  async getTreeList(type = null, keyword: string) {
    const where = {
      ...(isNull(type) ? {} : { type }),
      // ...(isEmpty(keyword) ? {} : { name: Like(`%${keyword}%`) }),
    };
    const allOrganizations = await this.getList({
      where,
      order: {
        sequence: 'ASC',
      },
    });
    const filteredOrganizations = allOrganizations.filter(item =>
      isEmpty(keyword) ? true : item.name.includes(keyword)
    );
    let list = filteredOrganizations;
    if (filteredOrganizations.length === 0) {
      return { list: [], count: 0 };
    }
    if (!isEmpty(keyword) && filteredOrganizations.length > 0) {
      const associatedOrganizations = new Set([]);
      filteredOrganizations.forEach(item => {
        this.addOrganizationParentsAndChildren(
          item,
          allOrganizations,
          associatedOrganizations
        );
      });
      list = Array.from(associatedOrganizations);
    }
    const topLevel = minBy(list, 'level').level;
    const rootOrganizations = list.filter(item => item.level === topLevel);
    const hierarchicalOrganizations = [];
    for (const rootOrganization of rootOrganizations) {
      hierarchicalOrganizations.push(
        this.getOrganizationTree(rootOrganization, list)
      );
    }
    return {
      list: hierarchicalOrganizations,
      count: filteredOrganizations.length,
    };
  }

  private addOrganizationParentsAndChildren(
    mdl: OrganizationEntity,
    allOrganizations: OrganizationEntity[],
    associatedOrganizations: Set<OrganizationEntity>
  ) {
    // 添加所有父级机构
    this.addOrganizationParents(mdl, allOrganizations, associatedOrganizations);

    // 添加所有子集机构
    this.addOrganizationChildren(
      mdl,
      allOrganizations,
      associatedOrganizations
    );
  }

  private addOrganizationParents(
    mdl: OrganizationEntity,
    allOrganizations: OrganizationEntity[],
    parents: Set<OrganizationEntity>
  ) {
    parents.add(mdl);
    if (!mdl.parentId) {
      return parents;
    } else {
      const parent = allOrganizations.find(item => item.id === mdl.parentId);
      if (parent) {
        return this.addOrganizationParents(parent, allOrganizations, parents);
      }
    }
  }

  private addOrganizationChildren(
    mdl: OrganizationEntity,
    allOrganizations: OrganizationEntity[],
    parents: Set<OrganizationEntity>
  ) {
    const children = allOrganizations.filter(item => item.parentId === mdl.id);
    children.forEach(item => {
      parents.add(item);
      this.addOrganizationChildren(item, allOrganizations, parents);
    });
  }

  private getOrganizationTree(
    mdl: OrganizationEntity,
    allOrganizations: OrganizationEntity[]
  ) {
    const children = allOrganizations.filter(item => item.parentId === mdl.id);
    if (children.length > 0) {
      mdl.children = children.map(child =>
        this.getOrganizationTree(child, allOrganizations)
      );
    }
    return mdl;
  }

  async checkCompanyNameExisted(name: string, id?: string) {
    return await this.entityModel.exist({
      where: {
        name,
        type: OrganizationType.Company,
        parentId: Not(IsNull()),
        ...(isEmpty(id) ? {} : { id: Not(id) }),
      },
    });
  }

  async importCompanyList(url: string) {
    const parentCompany = await this.getOneObject({
      where: {
        type: OrganizationType.Company,
        parentId: IsNull(),
      },
    });
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(url, {});
    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        if (row.number < 4) {
          continue;
        }
        const entity = {
          name: '',
          person: '',
          contact: '',
          address: '',
          enabled: true,
          parentId: parentCompany.id,
        };
        row.eachCell((cell, cellNumber) => {
          switch (cellNumber) {
            case 1:
              entity.name = cell.text;
              break;
            case 2:
              entity.person = cell.text;
              break;
            case 3:
              entity.contact = cell.text;
              break;
            case 4:
              entity.address = cell.text;
              break;
          }
        });
        if (await this.checkNameExisted(entity.name)) {
          continue;
        }
        await this.createObject(<OrganizationEntity>entity);
      }
    }
  }
}
