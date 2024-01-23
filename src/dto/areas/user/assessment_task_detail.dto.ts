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

export class UpdateAssessmentTaskDetailScoreDTO extends AssessmentTaskDetailDTO {}

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
