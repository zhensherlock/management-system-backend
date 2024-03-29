import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { OperationEntity } from './operation.entity';
import { ModuleRoleMappingEntity } from './module_role_mapping.entity';

@Entity({
  name: 'module',
})
export class ModuleEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '模块编号' })
  id: string;

  @Column({ length: 191, comment: '模块名称' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '模块简介' })
  description: string;

  @Column({ nullable: true, comment: '模块级别' })
  level: number;

  @Column({ length: 191, nullable: true, comment: '模块编码' })
  code: string;

  @Column({ length: 191, nullable: true, comment: '模块图标' })
  icon: string;

  @Column({ length: 191, nullable: true, comment: '模块目标' })
  target: string;

  @Column({ length: 191, nullable: true, comment: '模块组件路径' })
  component: string;

  @Column({ length: 191, nullable: true, comment: '模块链接' })
  url: string;

  @Column({ default: true, comment: '模块是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '模块路由元信息' })
  meta: object;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({
    name: 'parent_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '父级模块编号',
  })
  parentId: string;

  @Column({ name: 'is_leaf', default: true, comment: '是否叶子节点' })
  isLeaf: boolean;

  @Column({ default: false, comment: '默认是否展开' })
  expand: boolean;

  @Column({ default: 0, comment: '模块顺序' })
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

  @ManyToOne(() => ModuleEntity, node => node.children)
  @JoinColumn({ name: 'parent_id' })
  parent: ModuleEntity;

  @OneToMany(() => ModuleEntity, node => node.parent)
  children: ModuleEntity[];

  @OneToMany(() => OperationEntity, node => node.module)
  operations: OperationEntity[];

  @OneToMany(() => ModuleRoleMappingEntity, node => node.module, {
    cascade: true,
  })
  moduleRoleMappings: ModuleRoleMappingEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
