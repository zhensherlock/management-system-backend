import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';

@Entity({
  name: 'company_user_mapping',
})
@Index(['userId', 'companyId'])
export class CompanyUserMappingEntity {
  @PrimaryColumn('uuid', {
    name: 'company_id',
    length: 36,
  })
  companyId: string;

  @PrimaryColumn('uuid', {
    name: 'user_id',
    length: 36,
  })
  userId: string;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
  })
  createdDate: Date;

  @ManyToOne(() => CompanyEntity, node => node.companyUserMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToOne(() => UserEntity, node => node.companyUserMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
