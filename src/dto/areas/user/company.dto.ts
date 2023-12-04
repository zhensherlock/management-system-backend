import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class CompanyDTO {
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

  // @ApiProperty({ example: '教育局介绍', description: '组织简介' })
  // @Rule(
  //   RuleType.string()
  //     .max(150)
  //     .empty('')
  //     .trim(true)
  //     .error(
  //       handleParameterErrors({
  //         'string.max': {
  //           message: 'description.length.message',
  //           options: { group: 'organization' },
  //         },
  //         '*': {
  //           message: 'description.base.message',
  //           options: { group: 'organization' },
  //         },
  //       })
  //     )
  // )
  // description: string;

  @ApiProperty({ example: '张某某', description: '组织联系人' })
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

  @ApiProperty({ example: '110', description: '组织联系方式' })
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

  @ApiProperty({ example: '中国张家港', description: '组织地址' })
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
}

export class CreateCompanyDTO extends CompanyDTO {}

export class UpdateCompanyDTO extends CompanyDTO {}

export class GetCompanyListDTO extends GetListBaseDTO {}
