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
import { generateUUID } from '../util';
import { UserRoleMapping } from './user_role_mapping.entity';
import { OrganizationUserMapping } from './organization_user_mapping.entity';
import { Tenant } from './tenant.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '用户编号' })
  id: string;

  @Column({ length: 191, comment: '用户名' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '用户密码' })
  password: string;

  @Column({ length: 191, nullable: true, comment: '用户密码盐' })
  salt: string;

  @Column({
    name: 'real_name',
    length: 191,
    nullable: true,
    comment: '用户简介',
  })
  realName: string;

  @Column({ length: 191, nullable: true, comment: '用户简介' })
  description: string;

  @Column({ type: 'int', comment: '用户类型' })
  type: number;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({ name: 'tenant_id', length: 36, type: 'uuid', comment: '租户编号' })
  tenantId: string;

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

  @ManyToOne(() => Tenant, node => node.devices)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => UserRoleMapping, node => node.user)
  userRoleMappings: UserRoleMapping[];

  @OneToMany(() => OrganizationUserMapping, node => node.user)
  organizationUserMappings: OrganizationUserMapping[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
