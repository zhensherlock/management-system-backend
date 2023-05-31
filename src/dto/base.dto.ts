import { Rule, RuleType } from '@midwayjs/validate';
import { handleError } from '../error';

export class GetListBaseDTO {
  @Rule(RuleType.string())
  keyword: string;

  @Rule(
    RuleType.number()
      .integer()
      .error(
        handleError({
          message: 'i18n:current_page.validate.base.message',
          options: { group: 'validation' },
        })
      )
  )
  currentPage: number;

  @Rule(
    RuleType.number()
      .integer()
      .error(
        handleError({
          message: 'i18n:page_size.validate.base.message',
          options: { group: 'validation' },
        })
      )
  )
  pageSize: number;
}
