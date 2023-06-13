import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { generateUUID, updatedDateTransformer } from '../util';

@Entity({
  name: 'system_config',
})
export class SystemConfigEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '系统编号' })
  id: string;

  @Column({ length: 191, comment: '系统名称' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '系统简介' })
  description: string;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
    transformer: updatedDateTransformer,
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
  })
  deletedDate: Date;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
