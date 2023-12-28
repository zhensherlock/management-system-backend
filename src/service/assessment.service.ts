import { isEmpty } from 'lodash';
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { AssessmentEntity } from '../entity/assessment.entity';
import { Like, Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class AssessmentService extends BaseService<AssessmentEntity> {
  @InjectEntityModel(AssessmentEntity)
  entityModel: Repository<AssessmentEntity>;

  constructor() {
    super();
  }

  async getTreeList(keyword: string) {
    const list = await this.getList({
      where: {
        ...(isEmpty(keyword) ? {} : { title: Like(`%${keyword}%`) }),
        enabled: true,
      },
      order: {
        sequence: 'ASC',
      },
    });
    const rootAssessments = list.filter(item => item.parentId === null);
    const hierarchicalAssessments = [];
    for (const rootAssessment of rootAssessments) {
      hierarchicalAssessments.push(
        this.getAssessmentTree(rootAssessment, list)
      );
    }
    return { list: hierarchicalAssessments, count: list.length };
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
