import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { differenceWith, isEmpty } from 'lodash';
import { OrganizationUserMappingService } from './organization_user_mapping.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto/areas/admin/user.dto';
import { encrypt } from '../util';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  entityModel: Repository<UserEntity>;

  @Inject()
  organizationUserMappingService: OrganizationUserMappingService;

  constructor() {
    super();
  }

  async createUser(dto: CreateUserDTO) {
    const { hash, salt } = encrypt(dto.password);
    return await this.createObject(
      <UserEntity>Object.assign({}, <any>dto, {
        organizationUserMappings: dto.organizationIds.map(id =>
          this.organizationUserMappingService.entityModel.create({
            organizationId: id,
          })
        ),
        password: hash,
        salt,
      })
    );
  }

  async updateUser(user: UserEntity, dto: UpdateUserDTO): Promise<UserEntity> {
    Object.assign(user, dto);
    if (!isEmpty(dto.new_password)) {
      const { hash, salt } = encrypt(dto.new_password);
      user.password = hash;
      user.salt = salt;
    }
    const removeOrganizationUserMappings = differenceWith(
      user.organizationUserMappings,
      dto.organizationIds,
      (a, b) => a.organizationId === b
    );
    await this.organizationUserMappingService.entityModel.remove(
      removeOrganizationUserMappings
    );
    user.organizationUserMappings = dto.organizationIds.map(id =>
      this.organizationUserMappingService.entityModel.create({
        organizationId: id,
        userId: user.id,
      })
    );
    return await this.updateObject(user);
  }
}
