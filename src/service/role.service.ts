import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { UserRoleMappingService } from './user_role_mapping.service';

@Provide()
export class RoleService extends BaseService<RoleEntity> {
  @InjectEntityModel(RoleEntity)
  entityModel: Repository<RoleEntity>;

  @Inject()
  userRoleMappingService: UserRoleMappingService;

  constructor() {
    super();
  }

  async getRoleListByUserId(userId: string) {
    const roles: Partial<RoleEntity>[] = [];
    const relations = await this.userRoleMappingService.getList({
      where: {
        userId,
      },
      relations: ['role'],
    });
    relations.forEach(item => {
      if (!item.role.enabled) {
        return;
      }
      roles.push({
        id: item.role.id,
        code: item.role.code,
        name: item.role.name,
      });
    });
    return roles;
  }
}
