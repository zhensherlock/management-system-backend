import { Rule, RuleType } from '@midwayjs/validate';
import { handleParameterError, handleParameterErrors } from '../../../error';
import { GetListBaseDTO } from '../../base.dto';
import { ApiProperty } from '@midwayjs/swagger';
import { WorkOrderType } from '../../../constant';

export class WorkOrderDTO {
  @ApiProperty({ example: '', description: '需要修改的员工编号' })
  @Rule(
    RuleType.string()
      .uuid({ separator: false })
      .error(
        handleParameterError({
          message: 'employeeId.base.message',
          options: { group: 'work_order' },
        })
      )
  )
  employeeId: string;

  @ApiProperty({ example: 1, description: '工单类型' })
  @Rule(
    RuleType.number()
      .required()
      .valid(...Object.values(WorkOrderType))
      .error(
        handleParameterError({
          message: 'type.base.message',
          options: { group: 'work_order' },
        })
      )
  )
  type: number;

  @ApiProperty({ example: '', description: '需要修改的内容' })
  @Rule(
    RuleType.object().error(
      handleParameterError({
        message: 'content.base.message',
        options: { group: 'work_order' },
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
            options: { group: 'work_order' },
          },
          '*': {
            message: 'applyReason.base.message',
            options: { group: 'work_order' },
          },
        })
      )
  )
  applyReason: string;
}

export class CreateWorkOrderDTO extends WorkOrderDTO {}

export class AuditWorkOrderDTO extends WorkOrderDTO {
  @ApiProperty({ example: '', description: '审核状态' })
  @Rule(
    RuleType.string()
      .max(40)
      .empty('')
      .trim(true)
      .error(
        handleParameterError({
          message: 'status.base.message',
          options: { group: 'work_order' },
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
            options: { group: 'work_order' },
          },
          '*': {
            message: 'auditReason.base.message',
            options: { group: 'work_order' },
          },
        })
      )
  )
  auditReason: string;
}

export class GetWorkOrderListDTO extends GetListBaseDTO {}
