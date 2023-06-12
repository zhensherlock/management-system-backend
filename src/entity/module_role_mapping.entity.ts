import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Module } from './module.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'module_role_mapping',
})
export class ModuleRoleMapping {
  @PrimaryColumn('uuid', {
    name: 'module_id',
    length: 36,
  })
  moduleId: string;

  @PrimaryColumn('uuid', {
    name: 'role_id',
    length: 36,
  })
  roleId: string;

  @Column({ type: 'json', nullable: true, comment: '操作按钮配置信息' })
  operationOptions: object;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
  })
  createdDate: Date;

  @ManyToOne(() => Module, node => node.moduleRoleMappings)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @ManyToOne(() => RoleEntity, node => node.userRoleMappings)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
