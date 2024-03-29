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
            message: 'name.required.message',
            options: { group: 'organization' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'organization' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'name.base.message',
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
            message: 'description.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 'Michael', description: '组织联系人' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'person.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'person.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  person: string;

  @ApiProperty({ example: '15906111111', description: '组织联系方式' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'contact.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'contact.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  contact: string;

  @ApiProperty({ example: 'China', description: '组织地址' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'address.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'address.base.message',
            options: { group: 'organization' },
          },
        })
      )
  )
  address: string;

  @ApiProperty({ example: 1, description: '组织类型' })
  @Rule(
    RuleType.number()
      .required()
      .valid(...Object.values(OrganizationType))
      .error(
        handleParameterError({
          message: 'type.base.message',
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
            message: 'code.length.message',
            options: { group: 'organization' },
          },
          '*': {
            message: 'code.base.message',
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
        message: 'enabled.base.message',
        options: { group: 'organization' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '组织扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
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
          message: 'tenant_id.base.message',
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
          message: 'parent_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  parentId: string;
}

export class CreateOrganizationDTO extends OrganizationDTO {
  @ApiProperty({ example: null, description: '用户编号' })
  @Rule(
    RuleType.array()
      .items(RuleType.string().uuid({ separator: false }))
      .error(
        handleParameterError({
          message: 'user_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  userIds: string[];
}

export class UpdateOrganizationDTO extends OrganizationDTO {
  @ApiProperty({ example: null, description: '用户编号' })
  @Rule(
    RuleType.array()
      .items(RuleType.string().uuid({ separator: false }))
      .error(
        handleParameterError({
          message: 'user_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  userIds: string[];
}

export class GetOrganizationListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '租户编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'tenant_id.base.message',
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
          message: 'type.base.message',
          options: { group: 'organization' },
        })
      )
  )
  type: number;

  @ApiProperty({ example: null, description: '用户编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .error(
        handleParameterError({
          message: 'user_id.base.message',
          options: { group: 'organization' },
        })
      )
  )
  userIds: string[] | string;
}
