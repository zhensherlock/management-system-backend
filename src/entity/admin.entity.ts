import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { generateUUID } from '../util';

@Entity({
  name: 'admin',
})
export class Admin {
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

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
