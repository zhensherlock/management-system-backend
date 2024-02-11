import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { BaseDTO, GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { AssessmentTaskDetailStatus, AssessmentTaskStatus } from '../../../constant';

export class AssessmentTaskDTO {
  @ApiProperty({ example: '标题1', description: '考核任务标题' })
  @Rule(
    RuleType.string()
      .max(150)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'task.title.required.message',
            options: { group: 'assessment' },
          },
          'any.required': {
            message: 'task.title.required.message',
            options: { group: 'assessment' },
          },
          'string.max': {
            message: 'task.title.length.message',
            options: { group: 'assessment' },
          },
          '*': {
            message: 'task.title.base.message',
            options: { group: 'assessment' },
          },
        })
      )
  )
  title: string;

  // @ApiProperty({ example: {}, description: '考核项目' })
  // @Rule(
  //   RuleType.object().error(
  //     handleParameterError({
  //       message: 'task.content.base.message',
  //       options: { group: 'assessment' },
  //     })
  //   )
  // )
  // content: object;

  @ApiProperty({ example: 100, description: '考核基础分' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'task.basic_score.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  basicScore: number;

  @ApiProperty({ example: '介绍', description: '考核任务简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty(null)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'task.description.length.message',
            options: { group: 'assessment' },
          },
          '*': {
            message: 'task.description.base.message',
            options: { group: 'assessment' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 100, description: '分数等级配置' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'task.grade_setting.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  gradeSetting: object;

  @ApiProperty({ example: new Date(), description: '考核开始时间' })
  @Rule(
    RuleType.date().error(
      handleParameterError({
        message: 'task.start_date.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  startDate: Date;

  @ApiProperty({ example: new Date(), description: '考核结束时间' })
  @Rule(
    RuleType.date().error(
      handleParameterError({
        message: 'task.end_date.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  endDate: Date;

  @ApiProperty({ example: '', description: '考核任务状态' })
  @Rule(
    RuleType.string()
      .max(40)
      .valid(...Object.values(AssessmentTaskStatus))
      .trim(true)
      .error(
        handleParameterError({
          message: 'task.status.base.message',
          options: { group: 'assessment' },
        })
      )
  )
  status: string;
}

export class GetAssessmentTaskDetailFilterDTO extends BaseDTO {
  @ApiProperty({ example: '', description: '考核任务状态' })
  @Rule(
    RuleType.string()
      .max(40)
      .valid(...Object.values(AssessmentTaskDetailStatus))
      .trim(true)
      .error(
        handleParameterError({
          message: 'detail.status.base.message',
          options: { group: 'assessment' },
        })
      )
  )
  status: string;
}

export class CreateAssessmentTaskDTO extends AssessmentTaskDTO {}

export class UpdateAssessmentTaskDTO extends AssessmentTaskDTO {}

export class GetAssessmentTaskListDTO extends GetListBaseDTO {}
