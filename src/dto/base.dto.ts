import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError } from '../error';
import { ApiProperty } from '@midwayjs/swagger';

export class GetListBaseDTO {
  @ApiProperty({ description: '关键字' })
  @Rule(RuleType.string().empty('').trim(true))
  keyword: string;

  @ApiProperty({ description: '当前页数', example: 1 })
  @Rule(
    RuleType.number()
      .integer()
      .error(
        handleParameterError({
          message: 'i18n:current_page.validate.base.message',
          options: { group: 'validation' },
        })
      )
  )
  currentPage: number;

  @ApiProperty({ description: '每页条数', example: 20 })
  @Rule(
    RuleType.number()
      .integer()
      .error(
        handleParameterError({
          message: 'i18n:page_size.validate.base.message',
          options: { group: 'validation' },
        })
      )
  )
  pageSize: number;
}

export class ImportBaseDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '数据文件',
  })
  file: any;
}
