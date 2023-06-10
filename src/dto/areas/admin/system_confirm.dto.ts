import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { ApiProperty } from '@midwayjs/swagger';

export class SystemConfigDTO {
  @ApiProperty({ example: '智能安防系统', description: '系统名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'system' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'system' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'system' },
          },
          '*': {
            message: 'name.base.message',
            options: { group: 'system' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '智能安防系统介绍', description: '系统介绍' })
  @Rule(
    RuleType.string()
      .max(150)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'system' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'system' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: {}, description: '系统扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
        options: { group: 'system' },
      })
    )
  )
  options: object;
}

export class UpdateSystemConfigDTO extends SystemConfigDTO {}
