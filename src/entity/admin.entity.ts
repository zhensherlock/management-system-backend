import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { generateUUID, updatedDateTransformer } from '../util';

@Entity({
  name: 'admin',
})
export class Admin {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '管理员编号' })
  id: string;

  @Column({ length: 191, comment: '用户名' })
  name: string;

  @Column({ length: 191, comment: '管理员邮箱' })
  email: string;

  @Column({ length: 191, nullable: true, comment: '管理员密码' })
  password: string;

  @Column({ length: 191, nullable: true, comment: '管理员密码盐' })
  salt: string;

  @Column({
    name: 'real_name',
    length: 191,
    nullable: true,
    comment: '管理员真实姓名',
  })
  realName: string;

  @Column({ length: 191, nullable: true, comment: '管理员简介' })
  description: string;

  @Column({ default: true, comment: '管理员是否可用' })
  enabled: boolean;

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
