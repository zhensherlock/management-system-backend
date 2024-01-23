import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { find, flatMapDeep } from 'lodash';
import Big from 'big.js';
import { BaseService } from './base.service';
import { AssessmentTaskDetailEntity } from '../entity/assessment_task_detail.entity';
import { AssessmentTaskEntity } from '../entity/assessment_task.entity';
import { OrganizationService } from './organization.service';
import { AssessmentScoreType, AssessmentTaskDetailStatus } from '../constant';
import { AssessmentService } from './assessment.service';
import {
  AssessmentTaskContentType,
  AssessmentTaskDetailScoreContentType,
  AssessmentTaskGradeSetting,
  AssessmentTaskStatisticType,
} from '../types';

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
    const result: AssessmentTaskStatisticType = {
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

  evaluationScore(
    mdl: AssessmentTaskDetailEntity,
    submitUserId: string,
    scoreContent: AssessmentTaskDetailScoreContentType
  ) {
    mdl.status = AssessmentTaskDetailStatus.Submitted;
    mdl.submitUserId = submitUserId;
    mdl.submitDate = new Date();
    const assessmentTaskContent = mdl.assessmentTask
      .content as AssessmentTaskContentType;
    const flatContents = flatMapDeep(
      assessmentTaskContent.list,
      item => item.children || []
    );
    let totalScore = mdl.assessmentTask.basicScore;
    scoreContent.list.forEach(item => {
      const rule = find(flatContents, content => content.id === item.id);
      const score =
        rule && item.score > rule.maximumScore ? rule.maximumScore : item.score;
      if (item.scoreType === AssessmentScoreType.Add) {
        totalScore += score;
      } else {
        totalScore -= score;
      }
    });
    scoreContent.totalScore = totalScore;
    mdl.totalScore = totalScore;
    const gradeSetting = mdl.assessmentTask
      .gradeSetting as AssessmentTaskGradeSetting;
    const grade = this.getGrade(gradeSetting, totalScore);
    scoreContent.grade = grade;
    mdl.grade = grade;
    mdl.scoreContent = scoreContent;
  }

  getGrade(gradeSetting: AssessmentTaskGradeSetting, score: number) {
    for (const index in gradeSetting.list) {
      if (
        score >= gradeSetting.list[index].score[0] &&
        score <= gradeSetting.list[index].score[1]
      ) {
        return gradeSetting.list[index].grade;
      }
    }
    return null;
  }
}
