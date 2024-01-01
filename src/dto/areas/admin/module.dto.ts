import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
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
        handleParameterErrors({
          'string.empty': {
            message: 'name.required.message',
            options: { group: 'module' },
          },
          'any.required': {
            message: 'name.required.message',
            options: { group: 'module' },
          },
          'string.max': {
            message: 'name.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'name.base.message',
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
      .allow(null)
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'description.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'description.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  description: string;

  @ApiProperty({ example: 'sys', description: '模块代码' })
  @Rule(
    RuleType.string()
      .max(100)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'code.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'code.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'icon.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'icon.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'target.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'target.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'component.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'component.base.message',
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
        handleParameterErrors({
          'string.max': {
            message: 'url.length.message',
            options: { group: 'module' },
          },
          '*': {
            message: 'url.base.message',
            options: { group: 'module' },
          },
        })
      )
  )
  url: string;

  @ApiProperty({ example: true, description: '模块是否可用' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'enabled.base.message',
        options: { group: 'module' },
      })
    )
  )
  enabled: boolean;

  @ApiProperty({ example: {}, description: '模块扩展配置信息' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'options.base.message',
        options: { group: 'module' },
      })
    )
  )
  options: object;

  @ApiProperty({ example: null, description: '父级模块编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .empty(null)
      .error(
        handleParameterError({
          message: 'parent_id.base.message',
          options: { group: 'module' },
        })
      )
  )
  parentId: string;

  @ApiProperty({ example: true, description: '是否叶子节点' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'is_leaf.base.message',
        options: { group: 'module' },
      })
    )
  )
  isLeaf: boolean;

  @ApiProperty({ example: false, description: '默认是否展开' })
  @Rule(
    RuleType.boolean().error(
      handleParameterError({
        message: 'expand.base.message',
        options: { group: 'module' },
      })
    )
  )
  expand: boolean;

  @ApiProperty({ example: 0, description: '模块顺序' })
  @Rule(
    RuleType.number().error(
      handleParameterError({
        message: 'sequence.base.message',
        options: { group: 'module' },
      })
    )
  )
  sequence: number;
}

export class CreateModuleDTO extends ModuleDTO {
  // @ApiProperty({ example: null, description: '角色编号' })
  // @Rule(
  //   RuleType.array()
  //     .items(RuleType.string().uuid({ separator: false }))
  //     .error(
  //       handleParameterError({
  //         message: 'role_id.base.message',
  //         options: { group: 'module' },
  //       })
  //     )
  // )
  // roleIds: string[];
}

export class UpdateModuleDTO extends ModuleDTO {
  @ApiProperty({ example: null, description: '角色编号' })
  @Rule(
    RuleType.array()
      .items(RuleType.string().uuid({ separator: false }))
      .error(
        handleParameterError({
          message: 'role_id.base.message',
          options: { group: 'module' },
        })
      )
  )
  roleIds: string[];
}

export class GetModuleListDTO extends GetListBaseDTO {
  @ApiProperty({ example: null, description: '角色编号' })
  @Rule(
    RuleType.alternatives()
      .try(
        RuleType.array().items(RuleType.string().uuid({ separator: false })),
        RuleType.string().uuid()
      )
      .error(
        handleParameterError({
          message: 'role_id.base.message',
          options: { group: 'module' },
        })
      )
  )
  roleIds: string[] | string;
}
