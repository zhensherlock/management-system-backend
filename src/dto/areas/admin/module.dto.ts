import { Rule, RuleType } from '@midwayjs/validate';
import { handleError, handleErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class ModuleDTO {
  @ApiProperty({ example: '系统管理', description: '模块名称' })
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .trim(true)
      .error(
        handleErrors({
          'string.empty': {
            message: 'i18n:name.required.message',
            options: { group: 'module' },
          },
          'any.required': {
            message: 'i18n:name.required.message',
            options: { group: 'module' },
          },
          'string.max': {
            message: 'i18n:name.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:name.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  name: string;

  @ApiProperty({ example: '系统管理介绍', description: '模块简介' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:description.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:description.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 1, description: '模块级别' })
  @Rule(
    RuleType.number().error(
      handleError({
        message: 'i18n:level.base.message',
        options: { group: 'module' },
      })
    )
  )
  level: number;

  @ApiProperty({ example: 'sys', description: '模块代码' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:code.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:code.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  code: string;

  @ApiProperty({ example: 'config', description: '模块图标' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:icon.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:icon.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  icon: string;

  @ApiProperty({ example: 'blank', description: '模块目标' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:target.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:target.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  target: string;

  @ApiProperty({ example: '', description: '模块组件路径' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:component.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:component.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  component: string;

  @ApiProperty({ example: '', description: '模块链接' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleErrors({
          'string.max': {
            message: 'i18n:url.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'i18n:url.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  url: string;

  @ApiProperty({ example: true, description: '租户是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:enabled.base.message',
        options: { group: 'module' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '租户扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleError({
        message: 'i18n:options.base.message',
        options: { group: 'module' },
      })
    )
  )
  options: object;

  @ApiProperty({ example: null, description: '父级模块编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleError({
          message: 'i18n:parent_id.base.message',
          options: { group: 'module' },
        })
      )
  )
  parentId: string;

  @ApiProperty({ example: true, description: '是否叶子节点' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:is_leaf.base.message',
        options: { group: 'module' },
      })
    )
  )
  isLeaf: boolean;

  @ApiProperty({ example: false, description: '默认是否展开' })
  @Rule(
    RuleType.boolean().error(
      handleError({
        message: 'i18n:expand.base.message',
        options: { group: 'module' },
      })
    )
  )
  expand: boolean;

  @ApiProperty({ example: 0, description: '模块顺序' })
  @Rule(
    RuleType.number().error(
      handleError({
        message: 'i18n:sequence.base.message',
        options: { group: 'module' },
      })
    )
  )
  sequence: number;
}

export class CreateModuleDTO extends ModuleDTO {}

export class UpdateModuleDTO extends ModuleDTO {}

export class GetModuleListDTO extends GetListBaseDTO {}
