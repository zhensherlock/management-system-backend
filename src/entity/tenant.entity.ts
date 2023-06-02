import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { Device } from './device.entity';
import { Organization } from './organization.entity';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';

@Entity({
  name: 'tenant',
})
export class Tenant {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '租户编号' })
  id: string;

  @Column({ length: 191, comment: '租户名字' })
  name: string;

  @Column({ length: 191, nullable: true, comment: '租户简介' })
  description: string;

  @Column({ length: 191, nullable: true, comment: '租户地址' })
  address: string;

  @Column({ length: 191, nullable: true, comment: '租户国家' })
  country: string;

  @Column({ length: 191, nullable: true, comment: '租户省份' })
  province: string;

  @Column({ length: 191, nullable: true, comment: '租户城市' })
  city: string;

  @Column({ type: 'double', nullable: true, comment: '租户纬度' })
  latitude: number;

  @Column({ type: 'double', nullable: true, comment: '租户经度' })
  longitude: number;

  @Column({ default: true, comment: '租户是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @Column({ default: 0, comment: '租户顺序' })
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

  @OneToMany(() => Device, node => node.tenant)
  devices: Device[];

  @OneToMany(() => Organization, node => node.tenant)
  organizations: Organization[];

  // @OneToMany(() => User, user => user.tenant)
  // users: User[];
  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
