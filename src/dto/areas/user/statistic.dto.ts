import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../../../error';

export class GetAssessmentTaskStatisticDTO extends GetListBaseDTO {
  @ApiProperty({ example: '', description: '考核任务编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'assessmentTaskId.base.message',
          options: { group: 'statistic' },
        })
      )
  )
  assessmentTaskId: string;
}
