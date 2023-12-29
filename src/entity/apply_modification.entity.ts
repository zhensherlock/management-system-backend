import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
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

  @PrimaryColumn('uuid', {
    name: 'apply_user_id',
    length: 36,
  })
  applyUserId: string;

  @PrimaryColumn('uuid', {
    name: 'audit_user_id',
    length: 36,
  })
  auditUserId: string;

  @PrimaryColumn('uuid', {
    name: 'employee_id',
    length: 36,
  })
  employeeId: string;

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
