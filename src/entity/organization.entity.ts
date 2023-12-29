import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { TenantEntity } from './tenant.entity';
import { DeviceEntity } from './device.entity';
import { OrganizationUserMappingEntity } from './organization_user_mapping.entity';
import { EmployeeEntity } from './employee.entity';

@Entity({
  name: 'organization',
})
export class OrganizationEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '组织编号' })
  id: string;

  @Column({ length: 191, comment: '组织名字' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '组织联系人' })
  person: string;

  @Column({ length: 191, nullable: true, comment: '组织联系方式' })
  contact: string;

  @Column({ length: 191, nullable: true, comment: '组织地址' })
  address: string;

  @Column({ length: 191, nullable: true, comment: '组织简介' })
  description: string;

  @Column({ comment: '组织类型' })
  type: number;

  @Column({
    nullable: true,
    comment:
      '组织类别：1-幼儿园 2-小学 3-初级中学 4-九年一贯制学校 5-职业初中 6-完全中学 7-高级中学 8-十二年一贯制学校 9-职业高中学校 10-盲人学校 11-聋人学校 12-其他特殊教育学校 100-保安公司',
  })
  category: number;

  // stage:

  @Column({ length: 191, nullable: true, comment: '组织代码' })
  code: string;

  @Column({ default: true, comment: '组织是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({
    name: 'tenant_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '租户编号',
  })
  tenantId: string;

  @Column({
    name: 'parent_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '父级组织编号',
  })
  parentId: string;

  @Column({ comment: '组织层级' })
  level: number;

  @Column({ default: 0, comment: '组织顺序' })
  sequence: number;

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

  @ManyToOne(() => OrganizationEntity, node => node.children)
  @JoinColumn({ name: 'parent_id' })
  parent: OrganizationEntity;

  @OneToMany(() => OrganizationEntity, node => node.parent)
  children: OrganizationEntity[];

  @ManyToOne(() => TenantEntity, node => node.organizations)
  @JoinColumn({ name: 'tenant_id' })
  tenant: TenantEntity;

  @OneToMany(() => DeviceEntity, node => node.organization)
  devices: DeviceEntity[];

  @OneToMany(() => OrganizationUserMappingEntity, node => node.organization, {
    cascade: true,
  })
  organizationUserMappings: OrganizationUserMappingEntity[];

  @OneToMany(() => EmployeeEntity, node => node.companyOrganization)
  employees: EmployeeEntity[];

  @OneToMany(() => EmployeeEntity, node => node.schoolOrganization)
  securityStaff: EmployeeEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
