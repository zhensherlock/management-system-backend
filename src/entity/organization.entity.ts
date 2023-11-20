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

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
