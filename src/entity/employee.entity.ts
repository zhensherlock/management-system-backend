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
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { CompanyEntity } from './company.entity';
import { OrganizationEntity } from './organization.entity';

@Entity({
  name: 'employee',
})
export class EmployeeEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '员工编号' })
  id: string;

  @Column({
    name: 'job_number',
    nullable: true,
    length: 191,
    comment: '职工号',
  })
  jobNumber: string;

  @Column({ length: 191, comment: '员工姓名' })
  name: string;

  @Column({ length: 1, default: '1', comment: '员工性别' })
  sex: string;

  @Column({ name: 'certificate_number', length: 191, comment: '员工证件编号' })
  certificateNumber: string;

  @Column({ length: 191, comment: '员工联系方式' })
  contact: string;

  @Column({ length: 255, nullable: true, comment: '员工头像' })
  avatar: string;

  @Column({ length: 191, nullable: true, comment: '员工简介' })
  description: string;

  @Column({ type: 'datetime', nullable: true, comment: '员工生日' })
  birthday: Date;

  @Column({ length: 191, nullable: true, comment: '员工民族' })
  nation: string;

  @Column({ length: 191, nullable: true, comment: '员工籍贯' })
  nativePlace: string;

  @Column({ length: 191, nullable: true, comment: '员工住址' })
  address: string;

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

  @Column({
    name: 'company_id',
    length: 36,
    type: 'uuid',
    comment: '保安公司编号',
  })
  companyId: string;

  @Column({
    name: 'organization_id',
    length: 36,
    type: 'uuid',
    comment: '学校编号',
    nullable: true,
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

  @ManyToOne(() => CompanyEntity, node => node.employees)
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => OrganizationEntity, node => node.employees)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
