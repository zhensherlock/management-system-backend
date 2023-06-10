import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class OperationDTO {
  @ApiProperty({ example: '按钮1', description: '操作按钮名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'operation' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'operation' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'operation' },
          },
          '*': {
            message: 'name.base.message',
            options: { group: 'operation' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '系统管理介绍', description: '操作按钮简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'operation' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'operation' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 'sys', description: '操作按钮代码' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'code.length.message',
            options: { group: 'operation' },
          },
          '*': {
            message: 'code.base.message',
            options: { group: 'operation' },
          },
        })
      )
  )
  code: string;

  @ApiProperty({ example: true, description: '操作按钮是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'enabled.base.message',
        options: { group: 'operation' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '操作按钮扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
        options: { group: 'operation' },
      })
    )
  )
  options: object;

  @ApiProperty({ example: 0, description: '操作按钮顺序' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'sequence.base.message',
        options: { group: 'operation' },
      })
    )
  )
  sequence: number;

  @ApiProperty({ example: null, description: '所属模块编号' })
  @Rule(
    RuleType.string()
      .required()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'module_id.base.message',
          options: { group: 'operation' },
        })
      )
  )
  moduleId: string;
}

export class CreateOperationDTO extends OperationDTO {}

export class UpdateOperationDTO extends OperationDTO {}

export class GetOperationListDTO extends GetListBaseDTO {
  @ApiProperty({ description: '所属模块编号', example: null })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .empty('')
      .error(
        handleParameterError({
          message: 'module_id.base.message',
          options: { group: 'operation' },
        })
      )
  )
  module: string;
}
