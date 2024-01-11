import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../../../error';

export class GetOrganizationListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '组织类型' })
  @Rule(
    RuleType.alternatives()
      .empty(null)
      .try(RuleType.array().items(RuleType.number()), RuleType.number())
      .error(
        handleParameterError({
          message: 'type.base.message',
          options: { group: 'organization' },
        })
      )
  )
  type: number[] | number;

  @ApiProperty({ example: null, description: '最小层级' })
  @Rule(
    RuleType.number()
      .empty(null)
      .error(
        handleParameterError({
          message: 'minLevel.base.message',
          options: { group: 'organization' },
        })
      )
  )
  minLevel: number;
}
