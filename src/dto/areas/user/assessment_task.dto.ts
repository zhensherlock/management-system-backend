import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { AssessmentTaskStatus } from '../../../constant';

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
            message: 'title.required.message',
            options: { group: 'assessment_task' },
          },
          'any.required': {
            message: 'title.required.message',
            options: { group: 'assessment_task' },
          },
          'string.max': {
            message: 'title.length.message',
            options: { group: 'assessment_task' },
          },
          '*': {
            message: 'title.base.message',
            options: { group: 'assessment_task' },
          },
        })
      )
  )
  title: string;

  @ApiProperty({ example: {}, description: '考核项目' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'content.base.message',
        options: { group: 'assessment_task' },
      })
    )
  )
  content: object;

  @ApiProperty({ example: 100, description: '考核基础分' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'basic_score.base.message',
        options: { group: 'assessment_task' },
      })
    )
  )
  basicScore: number;

  @ApiProperty({ example: '介绍', description: '考核任务简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'assessment_task' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'assessment_task' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 100, description: '分数等级配置' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'grade_setting.base.message',
        options: { group: 'assessment_task' },
      })
    )
  )
  gradeSetting: object;

  @ApiProperty({ example: new Date(), description: '考核任务开始时间' })
  @Rule(
    RuleType.date().error(
      handleParameterError({
        message: 'start_date.base.message',
        options: { group: 'assessment_task' },
      })
    )
  )
  startDate: Date;

  @ApiProperty({ example: new Date(), description: '考核任务结束时间' })
  @Rule(
    RuleType.date().error(
      handleParameterError({
        message: 'end_date.base.message',
        options: { group: 'assessment_task' },
      })
    )
  )
  endDate: Date;

  @ApiProperty({ example: '', description: '考核任务状态' })
  @Rule(
    RuleType.string()
      .max(40)
      .valid(...Object.values(AssessmentTaskStatus))
      .empty('')
      .trim(true)
      .error(
        handleParameterError({
          message: 'status.base.message',
          options: { group: 'assessment_task' },
        })
      )
  )
  status: string;
}

export class CreateAssessmentTaskDTO extends AssessmentTaskDTO {}

export class UpdateAssessmentTaskDTO extends AssessmentTaskDTO {}

export class GetAssessmentTaskListDTO extends GetListBaseDTO {}
