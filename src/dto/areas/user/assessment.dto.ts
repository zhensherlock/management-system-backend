import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { AssessmentScoreType } from '../../../constant/assessment.constant';

export class AssessmentDTO {
  @ApiProperty({ example: '标题1', description: '考核标题' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'title.required.message',
            options: { group: 'assessment' },
          },
          'any.required': {
            message: 'title.required.message',
            options: { group: 'assessment' },
          },
          'string.max': {
            message: 'title.length.message',
            options: { group: 'assessment' },
          },
          '*': {
            message: 'title.base.message',
            options: { group: 'assessment' },
          },
        })
      )
  )
  title: string;

  @ApiProperty({ example: 0, description: '考核顺序' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'sequence.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  sequence: number;

  @ApiProperty({ example: 0, description: '考核分数类型' })
  @Rule(
    RuleType.string()
      .trim(true)
      .valid(...Object.values(AssessmentScoreType))
      .error(
        handleParameterError({
          message: 'score_type.base.message',
          options: { group: 'assessment' },
        })
      )
  )
  scoreType: string;

  @ApiProperty({ example: 100, description: '考核分数上限' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'maximum_score.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  maximumScore: number;

  @ApiProperty({ example: 1, description: '考核分数步数' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'score_step.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  scoreStep: number;

  @ApiProperty({ example: null, description: '父级考核编号' })
  @Rule(
    RuleType.string()
      .trim(true)
      .uuid({ separator: false })
      .empty(null)
      .error(
        handleParameterError({
          message: 'parent_id.base.message',
          options: { group: 'assessment' },
        })
      )
  )
  parentId: string;
}

export class CreateAssessmentDTO extends AssessmentDTO {}

export class UpdateAssessmentDTO extends AssessmentDTO {}

export class GetAssessmentListDTO extends GetListBaseDTO {}
