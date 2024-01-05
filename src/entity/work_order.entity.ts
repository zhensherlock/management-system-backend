import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { UserEntity } from './user.entity';
import { EmployeeEntity } from './employee.entity';
import { WorkOrderStatus } from '../constant/work_order.constant';

@Entity({
  name: 'work_order',
})
export class WorkOrderEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '工单编号' })
  id: string;

  @Column({
    name: 'apply_user_id',
    length: 36,
    comment: '申请用户编号',
  })
  applyUserId: string;

  @Column({
    name: 'audit_user_id',
    length: 36,
    nullable: true,
    comment: '审核用户编号',
  })
  auditUserId: string;

  @Column({
    name: 'employee_id',
    length: 36,
    nullable: true,
    comment: '工单关联的员工编号',
  })
  employeeId: string;

  @Column({ type: 'json', nullable: true, comment: '工单内容' })
  content: object;

  @Column({ type: 'tinyint', comment: '工单类型' })
  type: number;

  @Column({ default: WorkOrderStatus.Pending, length: 40, comment: '申请状态' })
  status: string;

  @Column({ length: 191, nullable: true, comment: '申请原因' })
  applyReason: string;

  @Column({ length: 191, nullable: true, comment: '审核原因' })
  auditReason: string;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
    transformer: createDateTransformer,
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    nullable: true,
    comment: '修改时间',
    transformer: updatedDateTransformer,
  })
  updatedDate: Date;

  @DeleteDateColumn({
    name: 'deleted_date',
    type: 'timestamp',
    nullable: true,
    comment: '删除时间',
    select: false,
  })
  deletedDate: Date;

  @ManyToOne(() => UserEntity, node => node.applyWorkOrders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apply_user_id' })
  applyUser: UserEntity;

  @ManyToOne(() => UserEntity, node => node.auditWorkOrders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audit_user_id' })
  auditUser: UserEntity;

  @ManyToOne(() => EmployeeEntity, node => node.workOrders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
