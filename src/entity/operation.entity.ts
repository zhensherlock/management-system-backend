import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { Module } from './module.entity';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';

@Entity({
  name: 'operation',
})
export class Operation {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '操作按钮编号' })
  id: string;

  @Column({ length: 191, comment: '操作按钮名字' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '操作按钮简介' })
  description: string;

  @Column({ length: 191, nullable: true, comment: '操作按钮代码' })
  code: string;

  @Column({ default: true, comment: '操作按钮是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({ default: 0, comment: '操作按钮顺序' })
  sequence: number;

  @Column({
    name: 'module_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '所属模块编号',
  })
  moduleId: string;

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

  @ManyToOne(() => Module, node => node.operations)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
