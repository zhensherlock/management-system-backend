import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../../../error';

export class GetOrganizationListDTO extends GetListBaseDTO {
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
