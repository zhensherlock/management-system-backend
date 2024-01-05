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

@Entity({
  name: 'apply_modification',
})
export class ApplyModificationEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '申请修改编号' })
  id: string;

  @Column({
    name: 'apply_user_id',
    length: 36,
    comment: '申请修改的用户编号',
  })
  applyUserId: string;

  @Column({
    name: 'audit_user_id',
    length: 36,
    nullable: true,
    comment: '审核修改的用户编号',
  })
  auditUserId: string;

  @Column({
    name: 'employee_id',
    length: 36,
    comment: '需要修改的员工编号',
  })
  employeeId: string;

  @Column({ type: 'json', nullable: true, comment: '需要修改的内容' })
  content: object;

  @Column({ default: 'pending', length: 40, comment: '申请状态' })
  status: string;

  @Column({ length: 191, comment: '申请原因' })
  applyReason: string;

  @Column({ length: 191, comment: '审核原因' })
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

  @ManyToOne(() => UserEntity, node => node.applyModifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apply_user_id' })
  applyUser: UserEntity;

  @ManyToOne(() => UserEntity, node => node.auditModifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audit_user_id' })
  auditUser: UserEntity;

  @ManyToOne(() => EmployeeEntity, node => node.applyModifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
