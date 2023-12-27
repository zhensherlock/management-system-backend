import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class AssessmentCategoryDTO {
  @ApiProperty({ example: '考核类别1', description: '考核类别名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'assessment_category' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'assessment_category' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'assessment_category' },
          },
          '*': {
            message: 'name.base.message',
            options: { group: 'assessment_category' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: 0, description: '考核类别顺序' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'sequence.base.message',
        options: { group: 'assessment_category' },
      })
    )
  )
  sequence: number;

  @ApiProperty({ example: 0, description: '考核类别类型' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'type.base.message',
        options: { group: 'assessment_category' },
      })
    )
  )
  type: number;

  @ApiProperty({ example: null, description: '父级考核类别编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'parent_id.base.message',
          options: { group: 'assessment_category' },
        })
      )
  )
  parentId: string;
}

export class CreateAssessmentCategoryDTO extends AssessmentCategoryDTO {}

export class UpdateAssessmentCategoryDTO extends AssessmentCategoryDTO {}

export class GetAssessmentCategoryListDTO extends GetListBaseDTO {}
