import { Rule, RuleType } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { DeviceBrand } from '../../../constant';

export class DeviceDTO {
  @ApiProperty({ example: '赵保安', description: '设备名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'device' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'device' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'device' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '', description: '设备简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'device' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: '', description: '设备IP' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleError({
          message: 'i18n:ip.base.message',
          options: { group: 'device' },
        })
      )
  )
  ip: string;

  @ApiProperty({ example: '', description: '设备登录用户名' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:login_name.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'i18n:login_name.base.message',
            options: { group: 'device' },
          },
        })
      )
  )
  loginName: string;

  @ApiProperty({ example: '', description: '设备登录密码' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:login_password.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'i18n:login_password.base.message',
            options: { group: 'device' },
          },
        })
      )
  )
  loginPassword: string;

  @ApiProperty({ example: '', description: '设备品牌' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .valid(...Object.values(DeviceBrand))
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:brand.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'i18n:brand.base.message',
            options: { group: 'device' },
          },
        })
      )
  )
  brand: string;

  @ApiProperty({ example: '', description: '设备rtsp地址' })
  @Rule(
    RuleType.string()
      .max(200)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:rtsp.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'i18n:rtsp.base.message',
            options: { group: 'device' },
          },
        })
      )
  )
  rtsp: string;

  @ApiProperty({ example: 90, description: '租户纬度' })
  @Rule(
    RuleType.number()
      .min(-90)
      .max(90)
      .error(
        handleError({
          message: 'i18n:latitude.base.message',
          options: { group: 'device' },
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
        handleError({
          message: 'i18n:longitude.base.message',
          options: { group: 'tendeviceant' },
        })
      )
  )
  longitude: number;

  @ApiProperty({ example: true, description: '设备是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:enabled.base.message',
        options: { group: 'device' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '设备扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'device' },
      })
    )
  )
  options: object;

  @ApiProperty({ example: null, description: '租户编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleError({
          message: 'i18n:tenant_id.base.message',
          options: { group: 'device' },
        })
      )
  )
  tenantId: string;

  @ApiProperty({ example: null, description: '组织编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleError({
          message: 'i18n:organization_id.base.message',
          options: { group: 'device' },
        })
      )
  )
  organizationId: string;
}

export class CreateDeviceDTO extends DeviceDTO {}

export class UpdateDeviceDTO extends DeviceDTO {}

export class GetDeviceListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '租户编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleError({
          message: 'i18n:tenant_id.base.message',
          options: { group: 'device' },
        })
      )
  )
  tenantId: string;

  @ApiProperty({ example: null, description: '组织编号' })
  @Rule(
    RuleType.string()
      .empty('')
      .uuid({ separator: false })
      .error(
        handleError({
          message: 'i18n:organization_id.base.message',
          options: { group: 'device' },
        })
      )
  )
  organizationId: string;
}
