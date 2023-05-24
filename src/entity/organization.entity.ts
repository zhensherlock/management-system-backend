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
import { generateUUID } from '../util';
import { Tenant } from './tenant.entity';
import { Device } from './device.entity';
import { OrganizationUserMapping } from './organization_user_mapping.entity';

@Entity({
  name: 'organization',
})
export class Organization {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '组织编号' })
  id: string;

  @Column({ length: 191, comment: '组织名字' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '组织简介' })
  description: string;

  @Column({ comment: '组织类型' })
  type: number;

  @Column({ length: 191, nullable: true, comment: '组织编号' })
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
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    nullable: true,
    comment: '修改时间',
  })
  updatedDate: Date;

  @DeleteDateColumn({
    name: 'deleted_date',
    type: 'timestamp',
    nullable: true,
    comment: '删除时间',
  })
  deletedDate: Date;

  @ManyToOne(() => Organization, node => node.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Organization;

  @OneToMany(() => Organization, node => node.parent)
  children: Organization[];

  @ManyToOne(() => Tenant, node => node.organizations)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Device, node => node.organization)
  devices: Device[];

  @OneToMany(() => OrganizationUserMapping, node => node.organization)
  organizationUserMappings: OrganizationUserMapping[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
