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
  name: 'device',
})
export class DeviceEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '设备编号' })
  id: string;

  @Column({ length: 191, comment: '设备名称' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '设备简介' })
  description: string;

  @Column({ length: 191, nullable: true, comment: '设备IP地址' })
  ip: string;

  @Column({
    name: 'login_name',
    length: 191,
    nullable: true,
    comment: '设备登录用户名',
  })
  loginName: string;

  @Column({
    name: 'login_password',
    length: 191,
    nullable: true,
    comment: '设备登录密码',
  })
  loginPassword: string;

  @Column({ length: 191, nullable: true, comment: '设备品牌' })
  brand: string;

  @Column({ length: 255, nullable: true, comment: '设备rtsp地址' })
  rtsp: string;

  @Column({ type: 'double', nullable: true, comment: '设备纬度' })
  latitude: number;

  @Column({ type: 'double', nullable: true, comment: '设备经度' })
  longitude: number;

  @Column({ default: true, comment: '设备是否可用' })
  enabled: boolean;

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
