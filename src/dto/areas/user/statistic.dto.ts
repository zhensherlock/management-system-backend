import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../../../error';
import { BaseDTO } from '../../base.dto';

export class GetStatisticBySchoolIdsDTO extends BaseDTO {
  @ApiProperty({ example: null, description: '学校编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .empty('')
      .error(
        handleParameterError({
          message: 'id.base.message',
          options: { group: 'school' },
        })
      )
  )
  schoolIds: string[] | string;
}
