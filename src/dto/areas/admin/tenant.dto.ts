import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class TenantDTO {
  @ApiProperty({ example: '测试租户1', description: '租户名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
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
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '测试租户介绍', description: '租户介绍' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'tenant' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: '测试租户地址', description: '租户地址' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:address.length.message',
            options: { group: 'tenant' },
          },
          '*': {
            message: 'i18n:address.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  address: string;

  @ApiProperty({ example: '中国', description: '租户所在国家' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:country.length.message',
            options: { group: 'tenant' },
          },
          '*': {
            message: 'i18n:country.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  country: string;

  @ApiProperty({ example: '江苏省', description: '租户所在省份' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:province.length.message',
            options: { group: 'tenant' },
          },
          '*': {
            message: 'i18n:province.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  province: string;

  @ApiProperty({ example: '苏州市', description: '租户所在城市' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:city.length.message',
            options: { group: 'tenant' },
          },
          '*': {
            message: 'i18n:city.base.message',
            options: { group: 'tenant' },
          },
        })
      )
  )
  city: string;

  @ApiProperty({ example: 90, description: '租户纬度' })
  @Rule(
    RuleType.number()
      .min(-90)
      .max(90)
      .error(
        handleParameterError({
          message: 'i18n:latitude.base.message',
          options: { group: 'tenant' },
        })
      )
  )
  latitude: number;

  @ApiProperty({ example: 180, description: '租户经度' })
  @Rule(
    RuleType.number()
      .min(-180)
      .max(180)
      .error(
        handleParameterError({
          message: 'i18n:longitude.base.message',
          options: { group: 'tenant' },
        })
      )
  )
  longitude: number;

  @ApiProperty({ example: true, description: '租户是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'i18n:enabled.base.message',
        options: { group: 'tenant' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '租户扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'i18n:options.base.message',
        options: { group: 'tenant' },
      })
    )
  )
  options: object;

  @ApiProperty({ example: 0, description: '租户顺序' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'i18n:sequence.base.message',
        options: { group: 'tenant' },
      })
    )
  )
  sequence: number;
}

export class CreateTenantDTO extends TenantDTO {}

export class UpdateTenantDTO extends TenantDTO {}

export class GetTenantListDTO extends GetListBaseDTO {}
