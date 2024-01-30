import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { find } from 'lodash';
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
import { recursiveFlat } from '../util/array';

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
    const assessmentContent = task.content as AssessmentTaskContentType;
    const flatContentList = recursiveFlat(assessmentContent.list);
    const scoreContent = {
      totalScore: task.basicScore,
      totalAddScore: 0,
      totalSubtractScore: 0,
      grade: '',
      detail: {},
    } as AssessmentTaskDetailScoreContentType;
    flatContentList.forEach(item => {
      if (!item.children) {
        scoreContent.detail[item.id] = {
          id: item.id,
          score: 0,
          message: '',
          scoreType: item.scoreType,
          files: [],
        };
      }
    });
    for (const index in schoolList) {
      const detail = new AssessmentTaskDetailEntity();
      detail.assessmentTaskId = task.id;
      detail.creatorUserId = task.creatorUserId;
      detail.receiveSchoolOrganizationId = schoolList[index].id;
      detail.status = AssessmentTaskDetailStatus.Pending;
      detail.assessmentContent = assessmentContent;
      detail.scoreContent = scoreContent;
      await this.entityModel.save(detail);
    }
  }

  async getStatistic(options: FindManyOptions<AssessmentTaskDetailEntity>) {
    const list = await this.getList(options);
    const result: AssessmentTaskStatisticType = {
      list,
      statistic: {
        total: list.length,
        submitted: 0,
        pending: 0,
        returned: 0,
        done: 0,
        donePercentage: 0,
      },
    };
    list.forEach(item => {
      switch (item.status) {
        case AssessmentTaskDetailStatus.Submitted:
          result.statistic.submitted++;
          break;
        case AssessmentTaskDetailStatus.Pending:
          result.statistic.pending++;
          break;
        case AssessmentTaskDetailStatus.Done:
          result.statistic.done++;
          break;
        case AssessmentTaskDetailStatus.Returned:
          result.statistic.returned++;
          break;
      }
    });
    result.statistic.donePercentage = new Big(result.statistic.done)
      .plus(result.statistic.submitted)
      .div(result.statistic.total)
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
    const flatContentList = recursiveFlat(assessmentTaskContent.list);
    let totalScore = mdl.assessmentTask.basicScore;
    let totalAddScore = 0;
    let totalSubtractScore = 0;
    Object.keys(scoreContent.detail).forEach(key => {
      const item = scoreContent.detail[key];
      const rule = find(flatContentList, content => content.id === item.id);
      const score =
        rule && item.score > rule.maximumScore ? rule.maximumScore : item.score;
      if (rule.scoreType === AssessmentScoreType.Add) {
        totalScore += score;
        totalAddScore += score;
      } else {
        totalScore -= score;
        totalSubtractScore += score;
      }
    });
    scoreContent.totalScore = totalScore;
    scoreContent.totalAddScore = totalAddScore;
    scoreContent.totalSubtractScore = totalSubtractScore;
    mdl.totalScore = totalScore;
    mdl.totalAddScore = totalAddScore;
    mdl.totalSubtractScore = totalSubtractScore;
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
