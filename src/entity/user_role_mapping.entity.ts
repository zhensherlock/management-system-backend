import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({
  name: 'user_role_mapping',
})
export class UserRoleMapping {
  @PrimaryColumn('uuid', {
    name: 'user_id',
    length: 36,
  })
  userId: string;

  @PrimaryColumn('uuid', {
    name: 'role_id',
    length: 36,
  })
  roleId: string;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
  })
  createdDate: Date;

  @ManyToOne(() => User, node => node.userRoleMappings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, node => node.userRoleMappings)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
