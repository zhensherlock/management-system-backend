import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { TenantEntity } from './tenant.entity';
import { OrganizationEntity } from './organization.entity';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';

@Entity({
  name: 'employee',
})
export class EmployeeEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '员工编号' })
  id: string;

  @Column({ name: 'job_number', length: 191, comment: '员工工号' })
  jobNumber: string;

  @Column({ length: 191, comment: '员工姓名' })
  name: string;

  @Column({ length: 1, default: '1', comment: '员工性别' })
  sex: string;

  @Column({ length: 255, nullable: true, comment: '员工头像' })
  avatar: string;

  @Column({ length: 191, nullable: true, comment: '员工简介' })
  description: string;

  @Column({ type: 'timestamp', nullable: true, comment: '员工生日' })
  birthday: Date;

  @Column({
    name: 'id_card',
    length: 191,
    nullable: true,
    comment: '员工身份证',
  })
  idCard: string;

  @Column({ default: '1', length: 1, comment: '员工状态' })
  status: string;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({ name: 'tenant_id', length: 36, type: 'uuid', comment: '租户编号' })
  tenantId: string;

  @Column({
    name: 'organization_id',
    length: 36,
    type: 'uuid',
    comment: '组织编号',
  })
  organizationId: string;

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

  @ManyToOne(() => TenantEntity, node => node.devices)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @ManyToOne(() => OrganizationEntity, node => node.devices)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
