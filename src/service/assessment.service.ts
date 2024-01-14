import { isEmpty, minBy } from 'lodash';
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { AssessmentEntity } from '../entity/assessment.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class AssessmentService extends BaseService<AssessmentEntity> {
  @InjectEntityModel(AssessmentEntity)
  entityModel: Repository<AssessmentEntity>;

  constructor() {
    super();
  }

  async getTreeList(keyword = '') {
    const allAssessments = await this.getList({
      order: {
        sequence: 'ASC',
      },
    });
    const filteredAssessments = allAssessments.filter(item =>
      isEmpty(keyword) ? true : item.title.includes(keyword)
    );
    let list = filteredAssessments;
    if (filteredAssessments.length === 0) {
      return { list: [], count: 0 };
    }
    if (!isEmpty(keyword) && filteredAssessments.length > 0) {
      const associatedAssessments = new Set([]);
      filteredAssessments.forEach(item => {
        this.addAssessmentParentsAndChildren(
          item,
          allAssessments,
          associatedAssessments
        );
      });
      list = Array.from(associatedAssessments);
    }
    const topLevel = minBy(list, 'level').level;
    const rootAssessments = list.filter(item => item.level === topLevel);
    const hierarchicalAssessments = [];
    for (const rootAssessment of rootAssessments) {
      hierarchicalAssessments.push(
        this.getAssessmentTree(rootAssessment, list)
      );
    }
    return { list: hierarchicalAssessments, count: list.length };
  }

  private addAssessmentParentsAndChildren(
    mdl: AssessmentEntity,
    allAssessments: AssessmentEntity[],
    associatedAssessments: Set<AssessmentEntity>
  ) {
    // 添加所有父级考核项
    this.addAssessmentParents(mdl, allAssessments, associatedAssessments);

    // 添加所有子集考核项
    this.addAssessmentChildren(mdl, allAssessments, associatedAssessments);
  }

  private addAssessmentParents(
    mdl: AssessmentEntity,
    allAssessments: AssessmentEntity[],
    parents: Set<AssessmentEntity>
  ) {
    parents.add(mdl);
    if (!mdl.parentId) {
      return parents;
    } else {
      const parent = allAssessments.find(item => item.id === mdl.parentId);
      if (parent) {
        return this.addAssessmentParents(parent, allAssessments, parents);
      }
    }
  }

  private addAssessmentChildren(
    mdl: AssessmentEntity,
    allAssessments: AssessmentEntity[],
    parents: Set<AssessmentEntity>
  ) {
    const children = allAssessments.filter(item => item.parentId === mdl.id);
    children.forEach(item => {
      parents.add(item);
      this.addAssessmentChildren(item, allAssessments, parents);
    });
  }

  private getAssessmentTree(
    mdl: AssessmentEntity,
    allAssessments: AssessmentEntity[]
  ) {
    const children = allAssessments.filter(item => item.parentId === mdl.id);
    if (children.length > 0) {
      mdl.children = children.map(child =>
        this.getAssessmentTree(child, allAssessments)
      );
    }
    return mdl;
  }
}
