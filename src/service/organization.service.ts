import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { OrganizationEntity } from '../entity/organization.entity';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isEmpty, isString, isArray, isNull, minBy } from 'lodash';
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

  async getTreeList(type = null, keyword: string, userIds = []) {
    let organizationUserMappings = [];
    if (isString(userIds)) {
      organizationUserMappings = [{ userId: userIds }];
    }
    if (isArray(userIds)) {
      organizationUserMappings = (<string[]>userIds).map(id => ({
        userId: id,
      }));
    }
    const where = {
      organizationUserMappings,
      ...(isNull(type) ? {} : { type }),
      ...(isEmpty(keyword) ? {} : { name: Like(`%${keyword}%`) }),
    };
    const list = await this.getList({
      where,
      order: {
        updatedDate: 'DESC',
      },
    });
    const topLevel = minBy(list, 'level').level;
    const rootOrganizations = list.filter(item => item.level === topLevel);
    const hierarchicalOrganizations = [];
    for (const rootOrganization of rootOrganizations) {
      hierarchicalOrganizations.push(
        this.getOrganizationTree(rootOrganization, list)
      );
    }
    return { list: hierarchicalOrganizations, count: list.length };
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
