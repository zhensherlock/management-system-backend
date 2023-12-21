import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class GetOrganizationListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '保安公司编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .empty('')
      .error(
        handleParameterError({
          message: 'company_id.base.message',
          options: { group: 'employee' },
        })
      )
  )
  companyIds: string[] | string;

  @ApiProperty({ example: null, description: '组织编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .empty('')
      .error(
        handleParameterError({
          message: 'organization_id.base.message',
          options: { group: 'employee' },
        })
      )
  )
  organizationIds: string[] | string;
}
