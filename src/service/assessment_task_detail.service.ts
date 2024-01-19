import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { AssessmentTaskDetailEntity } from '../entity/assessment_task_detail.entity';
import { AssessmentTaskEntity } from '../entity/assessment_task.entity';
import { OrganizationService } from './organization.service';
import { AssessmentTaskDetailStatus } from '../constant';
import { AssessmentService } from './assessment.service';

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
}
