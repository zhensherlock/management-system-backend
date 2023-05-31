import { Rule, RuleType, OmitDto } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';

export class TenantDTO {
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
            options: { group: 'tenant' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'tenant' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'tenant' },
          },
          'string.base': {
            message: 'i18n:name.base.message',
            options: { group: 'tenant' },
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
            options: { group: 'tenant' },
          },
          'string.base': {
            message: 'i18n:description.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  description: string;

  @Rule(
    RuleType.string()
      .max(150)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:address.length.message',
            options: { group: 'tenant' },
          },
          'string.base': {
            message: 'i18n:address.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  address: string;

  @Rule(
    RuleType.string()
      .max(150)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:country.length.message',
            options: { group: 'tenant' },
          },
          'string.base': {
            message: 'i18n:country.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  country: string;

  @Rule(
    RuleType.string()
      .max(150)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:province.length.message',
            options: { group: 'tenant' },
          },
          'string.base': {
            message: 'i18n:province.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  province: string;

  @Rule(
    RuleType.string()
      .max(150)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:city.length.message',
            options: { group: 'tenant' },
          },
          'string.base': {
            message: 'i18n:city.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  city: string;

  @Rule(
    RuleType.number()
      .min(-90)
      .max(90)
      .error(
        handleError({
          message: 'i18n:latitude.base.message',
          options: { group: 'tenant' },
        })
      )
  )
  latitude: number;

  @Rule(
    RuleType.number()
      .min(-180)
      .max(180)
      .error(
        handleError({
          message: 'i18n:longitude.base.message',
          options: { group: 'tenant' },
        })
      )
  )
  longitude: number;

  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:enabled.base.message',
        options: { group: 'tenant' },
      })
    )
  )
  enabled: boolean;

  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'tenant' },
      })
    )
  )
  options: object;
}

export class CreateTenantDTO extends OmitDto(TenantDTO, ['id']) {}

export class UpdateTenantDTO extends TenantDTO {}

export class GetTenantListDTO extends GetListBaseDTO {}
