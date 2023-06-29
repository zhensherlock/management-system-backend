import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'organization_user_mapping',
})
@Index(['userId', 'organizationId'])
export class OrganizationUserMappingEntity {
  @PrimaryColumn('uuid', {
    name: 'organization_id',
    length: 36,
  })
  organizationId: string;

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

  @ManyToOne(() => OrganizationEntity, node => node.organizationUserMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ManyToOne(() => UserEntity, node => node.organizationUserMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
