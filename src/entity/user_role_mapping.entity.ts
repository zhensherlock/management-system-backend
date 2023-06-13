import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'user_role_mapping',
})
export class UserRoleMappingEntity {
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

  @ManyToOne(() => UserEntity, node => node.userRoleMappings)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, node => node.userRoleMappings)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
