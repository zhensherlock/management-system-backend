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
            options: { group: 'school' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'school' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'school' },
          },
          '*': {
            message: 'name.base.message',
            options: { group: 'school' },
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
      .allow('', null)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'person.length.message',
            options: { group: 'school' },
          },
          '*': {
            message: 'person.base.message',
            options: { group: 'school' },
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
      .allow('', null)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'contact.length.message',
            options: { group: 'school' },
          },
          '*': {
            message: 'contact.base.message',
            options: { group: 'school' },
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
      .allow('', null)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'address.length.message',
            options: { group: 'school' },
          },
          '*': {
            message: 'address.base.message',
            options: { group: 'school' },
          },
        })
      )
  )
  address: string;

  @ApiProperty({ example: null, description: '父级机构编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .empty(null)
      .error(
        handleParameterError({
          message: 'parent_id.base.message',
          options: { group: 'school' },
        })
      )
  )
  parentId: string;

  @ApiProperty({ example: null, description: '指定的保安公司编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .empty(null)
      .error(
        handleParameterError({
          message: 'assigned_company_id.base.message',
          options: { group: 'school' },
        })
      )
  )
  assignedCompanyId: string;

  @ApiProperty({ example: 0, description: '学校顺序' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'sequence.base.message',
        options: { group: 'school' },
      })
    )
  )
  sequence: number;

  @ApiProperty({ example: 0, description: '类型' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'category.base.message',
        options: { group: 'school' },
      })
    )
  )
  category: number;
}

export class CreateSchoolDTO extends SchoolDTO {}

export class UpdateSchoolDTO extends SchoolDTO {}

export class GetSchoolListDTO extends GetListBaseDTO {}
