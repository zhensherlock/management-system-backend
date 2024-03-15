import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { OrganizationEntity } from '../entity/organization.entity';
import { In, IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { isArray, isEmpty, isNumber, minBy } from 'lodash';
import ExcelJS from 'exceljs';
import { OrganizationCategory, OrganizationType } from '../constant';
import { OrganizationUserMappingService } from './organization_user_mapping.service';

@Provide()
export class OrganizationService extends BaseService<OrganizationEntity> {
  @InjectEntityModel(OrganizationEntity)
  entityModel: Repository<OrganizationEntity>;

  @Inject()
  organizationUserMappingService: OrganizationUserMappingService;

  constructor() {
    super();
  }

  async getIdByName(name: string) {
    return await this.entityModel.findOne({
      where: {
        name,
      },
      select: ['id', 'level'],
    });
  }

  async existSchoolById(id: string): Promise<boolean> {
    return await this.entityModel.exists({
      where: {
        id,
        type: OrganizationType.School,
      },
    });
  }

  async checkNameExisted(name: string, id?: string) {
    return await this.entityModel.exists({
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

  async getAllSchoolList() {
    return this.getList({
      where: {
        type: OrganizationType.School,
        category: Not(OrganizationCategory.VirtualOrganization),
      },
      order: {
        sequence: 'ASC',
      },
    });
  }

  async getTreeList(type = null, keyword: string, minLevel?: number) {
    const where = {
      ...(isArray(type) && { type: In(type) }),
      ...(isNumber(type) && { type }),
      ...(isNumber(minLevel) && { level: MoreThanOrEqual(minLevel) }),
    };
    const allOrganizations = await this.getList({
      where,
      relations: ['assignedCompany'],
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
      count: list.length,
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

  async importSchoolList1(url: string) {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(url, {});
    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        let schoolName = '';
        row.eachCell((cell, cellNumber) => {
          switch (cellNumber) {
            case 1:
              schoolName = cell.text.trim();
              break;
          }
        });
        if (!(await this.checkNameExisted(schoolName))) {
          console.log(schoolName + '\r');
          continue;
        }
        const school = await this.getOneObject({
          where: {
            name: schoolName,
            type: OrganizationType.School,
          },
        });
        // school.assignedCompanyId = 'e18f57f4930a4e539278a251ec348421'; // 大德
        // school.assignedCompanyId = '1f7f6ab1ce7f4337984b8f9c75122e48'; // 张家港
        await this.updateObject(<OrganizationEntity>school);
      }
    }
  }

  async importSchoolList(url: string) {
    const parentSchool = await this.getOneObject({
      where: {
        type: OrganizationType.School,
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
          parentId: parentSchool.id,
          category: OrganizationCategory.School,
          type: OrganizationType.School,
          level: parentSchool.level + 1,
          // assignedCompanyId: null,
        };
        let parentName = '';
        row.eachCell((cell, cellNumber) => {
          switch (cellNumber) {
            case 1:
              entity.name = cell.text.trim();
              break;
            case 2:
              entity.category = this.getSchoolCategoryByName(cell.text);
              break;
            case 3:
              parentName = cell.text.trim();
              break;
            case 4:
              entity.person = cell.text.trim();
              break;
            case 5:
              entity.contact = cell.text.trim();
              break;
            case 6:
              entity.address = cell.text.trim();
              break;
            // case 6:
            //   entity.assignedCompanyId = cell.text;
            //   break;
          }
        });
        if (await this.checkNameExisted(entity.name)) {
          continue;
        }
        if (!isEmpty(parentName)) {
          await this.getIdByName(parentName).then(school => {
            entity.parentId = school.id;
            entity.level = school.level + 1;
          });
        }
        await this.createObject(<OrganizationEntity>entity);
      }
    }
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
          category: OrganizationCategory.SecurityCompany,
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

  async getOrganizationListByUserId(userId: string) {
    const organizations: Partial<OrganizationEntity>[] = [];
    const relations = await this.organizationUserMappingService.getList({
      where: {
        userId,
      },
      relations: ['organization'],
    });
    relations.forEach(item => {
      if (!item.organization.enabled) {
        return;
      }
      organizations.push({
        id: item.organization.id,
        code: item.organization.code,
        name: item.organization.name,
        type: item.organization.type,
        level: item.organization.level,
      });
    });
    return organizations;
  }

  /**
   * 根据父级ID获取所有子级ID，返回结果包含父级ID
   * @param id
   */
  async getAssociatedIdsByParentIds(id: string[] | string) {
    if (isEmpty(id)) {
      return [];
    }
    const parentIds = isArray(id) ? [...id] : [id];
    let result = [...parentIds];
    for (const id of parentIds) {
      result.push(id);
      result = result.concat(await this.getSubIdsByParentId(id, result));
    }
    return result;
  }

  /**
   * 根据父级ID获取所有子级ID
   * @param parentId
   * @param result
   */
  async getSubIdsByParentId(parentId: string, result: string[] = []) {
    const subOrganizations = await this.getList({
      where: {
        parentId,
      },
    });
    subOrganizations.forEach(item => {
      result.push(item.id);
      this.getSubIdsByParentId(item.id, result);
    });
    return result;
  }

  getSchoolCategoryByName(name: string) {
    switch (name) {
      case '幼儿园':
        return OrganizationCategory.Kindergarten;
      case '小学':
        return OrganizationCategory.PrimarySchool;
      case '初级中学':
        return OrganizationCategory.JuniorMiddleSchool;
      case '九年一贯制学校':
        return OrganizationCategory.NineYearCombinedSchool;
      case '职业初中':
        return OrganizationCategory.VocationalJuniorMiddleSchool;
      case '完全中学':
        return OrganizationCategory.FullMiddleSchool;
      case '高级中学':
        return OrganizationCategory.SeniorMiddleSchool;
      case '十二年一贯制学校':
        return OrganizationCategory.TwelveYearCombinedSchool;
      case '职业高中学校':
        return OrganizationCategory.VocationalHighSchool;
      case '盲人学校':
        return OrganizationCategory.BlindSchool;
      case '聋人学校':
        return OrganizationCategory.DeafSchool;
      case '其他特殊教育学校':
        return OrganizationCategory.SpecialEducationSchool;
      default:
        return OrganizationCategory.OtherSchoolOrganization;
    }
  }
}
