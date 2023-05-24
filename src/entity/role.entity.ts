import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { generateUUID } from '../util';
import { UserRoleMapping } from './user_role_mapping.entity';
import { ModuleRoleMapping } from './module_role_mapping.entity';

@Entity({
  name: 'role',
})
export class Role {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '角色编号' })
  id: string;

  @Column({ length: 191, comment: '角色名字' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '角色简介' })
  description: string;

  @Column({ default: true, comment: '角色是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

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

  @OneToMany(() => UserRoleMapping, node => node.role)
  userRoleMappings: UserRoleMapping[];

  @OneToMany(() => ModuleRoleMapping, node => node.role)
  moduleRoleMappings: ModuleRoleMapping[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
