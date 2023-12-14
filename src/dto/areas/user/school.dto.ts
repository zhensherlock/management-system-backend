import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class SchoolDTO {
  @ApiProperty({ example: '教育局', description: '学校名称' })
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

  @ApiProperty({ example: '张某某', description: '学校联系人' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .empty(null)
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

  @ApiProperty({ example: '110', description: '学校联系方式' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .empty(null)
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

  @ApiProperty({ example: '中国张家港', description: '学校地址' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .empty(null)
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

export class CreateSchoolDTO extends SchoolDTO {}

export class UpdateSchoolDTO extends SchoolDTO {}

export class GetSchoolListDTO extends GetListBaseDTO {}
