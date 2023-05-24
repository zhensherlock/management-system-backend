import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity({
  name: 'organization_user_mapping',
})
export class OrganizationUserMapping {
  @PrimaryColumn('uuid', {
    name: 'organization_id',
    length: 36,
  })
  userId: string;

  @PrimaryColumn('uuid', {
    name: 'user_id',
    length: 36,
  })
  roleId: string;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
  })
  createdDate: Date;

  @ManyToOne(() => Organization, node => node.organizationUserMappings)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User, node => node.organizationUserMappings)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
