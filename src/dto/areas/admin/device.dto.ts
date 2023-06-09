import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
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
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'device' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'device' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'name.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'description.base.message',
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
        handleParameterError({
          message: 'ip.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'login_name.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'login_name.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'login_password.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'login_password.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'brand.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'brand.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'rtsp.length.message',
            options: { group: 'device' },
          },
          '*': {
            message: 'rtsp.base.message',
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
        handleParameterError({
          message: 'latitude.base.message',
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
        handleParameterError({
          message: 'longitude.base.message',
          options: { group: 'tendeviceant' },
        })
      )
  )
  longitude: number;

  @ApiProperty({ example: true, description: '设备是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'enabled.base.message',
        options: { group: 'device' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '设备扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
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
        handleParameterError({
          message: 'tenant_id.base.message',
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
        handleParameterError({
          message: 'organization_id.base.message',
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
        handleParameterError({
          message: 'tenant_id.base.message',
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
        handleParameterError({
          message: 'organization_id.base.message',
          options: { group: 'device' },
        })
      )
  )
  organizationId: string;
}
