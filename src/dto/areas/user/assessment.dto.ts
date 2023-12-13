import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

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

  @ApiProperty({ example: null, description: '考核类型编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'assessment_category_id.base.message',
          options: { group: 'assessment' },
        })
      )
  )
  assessmentCategoryId: string;
}

export class CreateAssessmentDTO extends AssessmentDTO {}

export class UpdateAssessmentDTO extends AssessmentDTO {}

export class GetAssessmentListDTO extends GetListBaseDTO {}
