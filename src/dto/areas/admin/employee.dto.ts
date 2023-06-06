import { Rule, RuleType } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { EmployeeSex, EmployeeStatus } from '../../../constant';

export class EmployeeDTO {
  @ApiProperty({ example: '101', description: '员工工号' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:job_number.required.message',
            options: { group: 'employee' },
          },
          'any.required': {
            message: 'i18n:job_number.required.message',
            options: { group: 'employee' },
          },
          'string.max': {
            message: 'i18n:job_number.length.message',
            options: { group: 'employee' },
          },
          '*': {
            message: 'i18n:job_number.base.message',
            options: { group: 'employee' },
          },
        })
      )
  )
  jobNumber: string;

  @ApiProperty({ example: '赵保安', description: '员工名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'employee' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'employee' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'employee' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'employee' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '1', description: '员工性别' })
  @Rule(
    RuleType.string()
      .required()
      .max(1)
      .empty('')
      .trim(true)
      .valid(...Object.values(EmployeeSex))
      .error(
        handleError({
          message: 'i18n:sex.base.message',
          options: { group: 'employee' },
        })
      )
  )
  sex: string;

  @ApiProperty({ example: '', description: '员工头像' })
  @Rule(
    RuleType.string()
      .max(255)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:avatar.length.message',
            options: { group: 'employee' },
          },
          '*': {
            message: 'i18n:avatar.base.message',
            options: { group: 'employee' },
          },
        })
      )
  )
  avatar: string;

  @ApiProperty({ example: '赵保安介绍', description: '员工简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'employee' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'employee' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: new Date(), description: '员工生日' })
  @Rule(
    RuleType.date().error(
      handleError({
        message: 'i18n:birthday.base.message',
        options: { group: 'employee' },
      })
    )
  )
  birthday: Date;

  @ApiProperty({ example: '', description: '员工身份证' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:id_card.length.message',
            options: { group: 'employee' },
          },
          '*': {
            message: 'i18n:id_card.base.message',
            options: { group: 'employee' },
          },
        })
      )
  )
  idCard: string;

  @ApiProperty({ example: '1', description: '员工状态' })
  @Rule(
    RuleType.string()
      .required()
      .max(1)
      .empty('')
      .trim(true)
      .valid(...Object.values(EmployeeStatus))
      .error(
        handleError({
          message: 'i18n:status.base.message',
          options: { group: 'employee' },
        })
      )
  )
  status: string;

  @ApiProperty({ example: {}, description: '员工扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'employee' },
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
          options: { group: 'employee' },
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
          options: { group: 'employee' },
        })
      )
  )
  organizationId: string;
}

export class CreateEmployeeDTO extends EmployeeDTO {}

export class UpdateEmployeeDTO extends EmployeeDTO {}

export class GetEmployeeListDTO extends GetListBaseDTO {}
