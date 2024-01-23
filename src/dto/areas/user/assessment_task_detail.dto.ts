import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../../../error';
import { AssessmentTaskDetailStatus } from '../../../constant';

export class AssessmentTaskDetailDTO {
  @ApiProperty({ example: {}, description: '打分信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'detail.score_content.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  scoreContent: object;
}

export class EvaluationScoreDTO extends AssessmentTaskDetailDTO {
  @ApiProperty({ example: true, description: '是否保存草稿' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'detail.is_draft.base.message',
        options: { group: 'assessment' },
      })
    )
  )
  isDraft: boolean;
}

export class GetAssessmentTaskDetailListDTO extends GetListBaseDTO {
  @ApiProperty({ example: '', description: '任务状态' })
  @Rule(
    RuleType.string()
      .max(40)
      .valid(...Object.values(AssessmentTaskDetailStatus))
      .empty('')
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
