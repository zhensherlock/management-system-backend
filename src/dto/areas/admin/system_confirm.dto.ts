import { OmitDto, Rule, RuleType } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';

export class SystemConfigDTO {
  @Rule(RuleType.string().max(36).required())
  id: string;

  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'system' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'system' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'system' },
          },
          'string.base': {
            message: 'i18n:name.base.message',
            options: { group: 'system' },
          },
        })
      )
  )
  name: string;

  @Rule(
    RuleType.string()
      .max(150)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'system' },
          },
          'string.base': {
            message: 'i18n:description.base.message',
            options: { group: 'system' },
          },
        })
      )
  )
  description: string;

  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'system' },
      })
    )
  )
  options: object;
}

export class UpdateSystemConfigDTO extends OmitDto(SystemConfigDTO, ['id']) {}
