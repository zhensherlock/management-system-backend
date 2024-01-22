import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { AssessmentTaskDetailEntity } from '../entity/assessment_task_detail.entity';
import { AssessmentTaskEntity } from '../entity/assessment_task.entity';
import { OrganizationService } from './organization.service';
import { AssessmentTaskDetailStatus } from '../constant';
import { AssessmentService } from './assessment.service';
import { AssessmentTaskStatistic } from '../types';
import Big from 'big.js';

@Provide()
export class AssessmentTaskDetailService extends BaseService<AssessmentTaskDetailEntity> {
  @InjectEntityModel(AssessmentTaskDetailEntity)
  entityModel: Repository<AssessmentTaskDetailEntity>;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  assessmentService: AssessmentService;

  constructor() {
    super();
  }

  async publicTask(task: AssessmentTaskEntity) {
    const schoolList = await this.organizationService.getAllSchoolList();
    for (const index in schoolList) {
      const detail = new AssessmentTaskDetailEntity();
      detail.assessmentTaskId = task.id;
      detail.creatorUserId = task.creatorUserId;
      detail.receiveSchoolOrganizationId = schoolList[index].id;
      detail.status = AssessmentTaskDetailStatus.Pending;
      detail.assessmentContent = task.content;
      await this.entityModel.save(detail);
    }
  }

  async getStatistic(assessmentId: string) {
    const list = await this.entityModel.find({
      where: {
        assessmentTaskId: assessmentId,
      },
    });
    const result: AssessmentTaskStatistic = {
      total: list.length,
      submitted: 0,
      pending: 0,
      returned: 0,
      done: 0,
      donePercentage: 0,
    };
    list.forEach(item => {
      switch (item.status) {
        case AssessmentTaskDetailStatus.Submitted:
          result.submitted++;
          break;
        case AssessmentTaskDetailStatus.Pending:
          result.pending++;
          break;
        case AssessmentTaskDetailStatus.Done:
          result.done++;
          break;
        case AssessmentTaskDetailStatus.Returned:
          result.returned++;
          break;
      }
    });
    result.donePercentage = new Big(result.done)
      .div(result.total)
      .times(100)
      .toNumber();
    return result;
  }
}
