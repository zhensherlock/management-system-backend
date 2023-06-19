import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
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
import { UserRoleMappingEntity } from './user_role_mapping.entity';
import { OrganizationUserMappingEntity } from './organization_user_mapping.entity';
import { TenantEntity } from './tenant.entity';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '用户编号' })
  id: string;

  @Column({ length: 191, comment: '用户名' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '用邮箱' })
  email: string;

  @Column({ length: 191, nullable: true, comment: '用户电话' })
  tel: string;

  @Column({ length: 1, comment: '用户类型' })
  type: string;

  @Column({ length: 191, comment: '用户密码', select: false })
  password: string;

  @Column({ length: 191, comment: '用户密码盐', select: false })
  salt: string;

  @Column({
    name: 'real_name',
    length: 191,
    nullable: true,
    comment: '用户真实姓名',
  })
  realName: string;

  @Column({ length: 191, nullable: true, comment: '用户简介' })
  description: string;

  @Column({ default: true, comment: '用户是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({ name: 'tenant_id', length: 36, type: 'uuid', comment: '租户编号' })
  tenantId: string;

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

  @OneToMany(() => UserRoleMappingEntity, node => node.user)
  userRoleMappings: UserRoleMappingEntity[];

  @OneToMany(() => OrganizationUserMappingEntity, node => node.user, {
    cascade: true,
  })
  organizationUserMappings: OrganizationUserMappingEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
