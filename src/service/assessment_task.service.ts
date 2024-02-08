import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { BaseService } from './base.service';
import { AssessmentTaskEntity } from '../entity/assessment_task.entity';
import { AssessmentTaskSummaryStatisticType } from '../types';
import { AssessmentTaskStatus } from '../constant';
import Big from 'big.js';

@Provide()
export class AssessmentTaskService extends BaseService<AssessmentTaskEntity> {
  @InjectEntityModel(AssessmentTaskEntity)
  entityModel: Repository<AssessmentTaskEntity>;

  constructor() {
    super();
  }

  async getAssessmentTaskSummaryStatistic() {
    const normalList = await this.getList({
      where: {
        status: Not(AssessmentTaskStatus.Cancellation),
      },
    });
    const result: AssessmentTaskSummaryStatisticType = {
      published: 0,
      draft: 0,
      official: 0,
      done: 0,
      donePercentage: 0,
    };
    normalList.forEach(item => {
      switch (item.status) {
        case AssessmentTaskStatus.Draft:
          result.draft++;
          break;
        case AssessmentTaskStatus.Official:
          result.official++;
          break;
        case AssessmentTaskStatus.Done:
          result.done++;
          break;
      }
    });
    result.published = result.official + result.done;
    result.donePercentage = new Big(result.done)
      .div(result.published)
      .times(100)
      .toNumber();
    return result;
  }

  async getAssessmentTaskPublishedGroupList() {
    const list = await this.getList({
      where: {
        status: In([AssessmentTaskStatus.Official, AssessmentTaskStatus.Done]),
      },
      order: {
        endDate: 'DESC',
        startDate: 'DESC',
        updatedDate: 'DESC',
      },
    });
    const result: Record<string, AssessmentTaskEntity[]> = {
      official: [],
      done: [],
    };
    list.forEach(item => {
      switch (item.status) {
        case AssessmentTaskStatus.Official:
          result.official.push(item);
          break;
        case AssessmentTaskStatus.Done:
          result.done.push(item);
          break;
      }
    });
    return result;
  }
}
