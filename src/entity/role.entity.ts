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
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { UserRoleMappingEntity } from './user_role_mapping.entity';
import { ModuleRoleMappingEntity } from './module_role_mapping.entity';

@Entity({
  name: 'role',
})
export class RoleEntity {
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

  @OneToMany(() => UserRoleMappingEntity, node => node.role, {
    cascade: true,
  })
  userRoleMappings: UserRoleMappingEntity[];

  @OneToMany(() => ModuleRoleMappingEntity, node => node.role, {
    cascade: true,
  })
  moduleRoleMappings: ModuleRoleMappingEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
