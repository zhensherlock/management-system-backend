import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';

export class ApplyModificationDTO {
  @ApiProperty({ example: '', description: '需要修改的员工编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'employeeId.base.message',
          options: { group: 'apply_modification' },
        })
      )
  )
  employeeId: string;

  @ApiProperty({ example: '', description: '需要修改的内容' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'content.base.message',
        options: { group: 'apply_modification' },
      })
    )
  )
  content: object;

  @ApiProperty({ example: '', description: '申请原因' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'applyReason.length.message',
            options: { group: 'apply_modification' },
          },
          '*': {
            message: 'applyReason.base.message',
            options: { group: 'apply_modification' },
          },
        })
      )
  )
  applyReason: string;
}

export class CreateApplyModificationDTO extends ApplyModificationDTO {}

export class AuditApplyModificationDTO extends ApplyModificationDTO {
  @ApiProperty({ example: '', description: '审核状态' })
  @Rule(
    RuleType.string()
      .max(40)
      .empty('')
      .trim(true)
      .error(
        handleParameterError({
          message: 'status.base.message',
          options: { group: 'apply_modification' },
        })
      )
  )
  status: string;

  @ApiProperty({ example: '', description: '审核原因' })
  @Rule(
    RuleType.string()
      .max(150)
      .empty('')
      .trim(true)
      .error(
        handleParameterErrors({
          'string.max': {
            message: 'auditReason.length.message',
            options: { group: 'apply_modification' },
          },
          '*': {
            message: 'auditReason.base.message',
            options: { group: 'apply_modification' },
          },
        })
      )
  )
  auditReason: string;
}

export class GetApplyModificationListDTO extends GetListBaseDTO {}
