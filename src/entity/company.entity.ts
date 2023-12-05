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
import { CompanyUserMappingEntity } from './company_user_mapping.entity';
import { EmployeeEntity } from './employee.entity';

@Entity({
  name: 'company',
})
export class CompanyEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '保安公司编号' })
  id: string;

  @Column({ length: 191, comment: '保安公司名字' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '保安公司联系人' })
  person: string;

  @Column({ length: 191, nullable: true, comment: '保安公司联系方式' })
  contact: string;

  @Column({ length: 191, nullable: true, comment: '保安公司地址' })
  address: string;

  @Column({ length: 191, nullable: true, comment: '保安公司简介' })
  description: string;

  @Column({ default: true, comment: '保安公司是否可用' })
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

  @OneToMany(() => CompanyUserMappingEntity, node => node.company, {
    cascade: true,
  })
  companyUserMappings: CompanyUserMappingEntity[];

  @OneToMany(() => EmployeeEntity, node => node.company)
  employees: EmployeeEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
