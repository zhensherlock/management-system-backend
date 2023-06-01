import { OmitDto, Rule, RuleType } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';
import { ApiProperty } from '@midwayjs/swagger';

export class SystemConfigDTO {
  @ApiProperty({
    example: '50e743d998244f81a46db4acc6aa2d8d',
    description: '系统编号',
  })
  @Rule(RuleType.string().max(36).required())
  id: string;

  @ApiProperty({
    example: '智能安防系统',
    description: '系统名称',
  })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'system' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'system' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'system' },
          },
          'string.base': {
            message: 'i18n:name.base.message',
            options: { group: 'system' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({
    example: '智能安防系统介绍',
    description: '系统介绍',
  })
  @Rule(
    RuleType.string()
      .max(150)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'system' },
          },
          'string.base': {
            message: 'i18n:description.base.message',
            options: { group: 'system' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({
    example: {},
    description: '系统扩展配置信息',
  })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'system' },
      })
    )
  )
  options: object;
}

export class UpdateSystemConfigDTO extends OmitDto(SystemConfigDTO, ['id']) {}
