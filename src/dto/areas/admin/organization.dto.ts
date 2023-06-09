import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { OrganizationType } from '../../../constant';

export class OrganizationDTO {
  @ApiProperty({ example: '教育局', description: '组织名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'organization' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'organization' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '教育局介绍', description: '组织简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 1, description: '组织类型' })
  @Rule(
    RuleType.number()
      .required()
      .valid(...Object.values(OrganizationType))
      .error(
        handleParameterError({
          message: 'i18n:type.base.message',
          options: { group: 'organization' },
        })
      )
  )
  type: number;

  @ApiProperty({ example: 'jyj', description: '组织代码' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'i18n:code.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'i18n:code.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  code: string;

  @ApiProperty({ example: true, description: '组织是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'i18n:enabled.base.message',
        options: { group: 'organization' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '组织扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'i18n:options.base.message',
        options: { group: 'organization' },
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
          message: 'i18n:tenant_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  tenantId: string;

  @ApiProperty({ example: null, description: '父级组织编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'i18n:parent_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  parentId: string;
}

export class CreateOrganizationDTO extends OrganizationDTO {}

export class UpdateOrganizationDTO extends OrganizationDTO {}

export class GetOrganizationListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '租户编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'i18n:tenant_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  tenantId: string;

  @ApiProperty({ example: 1, description: '组织类型' })
  @Rule(
    RuleType.number()
      .required()
      .valid(...Object.values(OrganizationType))
      .error(
        handleParameterError({
          message: 'i18n:type.base.message',
          options: { group: 'organization' },
        })
      )
  )
  type: number;
}
