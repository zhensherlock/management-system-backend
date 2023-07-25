import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { differenceWith, isEmpty } from 'lodash';
import { OrganizationUserMappingService } from './organization_user_mapping.service';
import { UserRoleMappingService } from './user_role_mapping.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto/areas/admin/user.dto';
import { encrypt } from '../util';
import { CommonError } from '../error';
import ExcelJS from 'exceljs';
import { Context } from '@midwayjs/koa';
import { CaptchaService } from '@midwayjs/captcha';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  entityModel: Repository<UserEntity>;

  @Inject()
  ctx: Context;

  @Inject()
  captchaService: CaptchaService;

  fullSelects = [
    'id',
    'name',
    'email',
    'tel',
    'password',
    'salt',
    'realName',
    'description',
    'enabled',
    'options',
    'tenantId',
  ];

  @Inject()
  organizationUserMappingService: OrganizationUserMappingService;

  @Inject()
  userRoleMappingService: UserRoleMappingService;

  constructor() {
    super();
  }

  async tryLogin(
    account: string,
    password: string,
    captchaId: string,
    captcha: string
  ) {
    if (
      this.checkPasswordErrorNumber()
        ? !(await this.captchaService.check(captchaId, captcha))
        : false
    ) {
      throw new CommonError('captcha.base.message', {
        group: 'passport',
      });
    }
    const mdl = await this.getOneObject({
      select: ['id', 'password', 'salt', 'enabled', 'tenantId'],
      relations: ['userRoleMappings', 'userRoleMappings.role'],
      where: {
        name: account,
      },
    });
    if (!mdl) {
      throw new CommonError('user.nonexistence.message', {
        group: 'passport',
      });
    }
    if (!mdl.enabled) {
      throw new CommonError('user.disabled.message', {
        group: 'passport',
      });
    }
    if (mdl.password !== encrypt(password, mdl.salt).hash) {
      this.addPasswordErrorNumber();
      throw new CommonError('user.error.password.message', {
        group: 'passport',
      });
    }
    return mdl;
  }

  async createUser(dto: CreateUserDTO) {
    const { hash, salt } = encrypt(dto.password);
    return await this.createObject(
      <UserEntity>Object.assign({}, <any>dto, {
        organizationUserMappings: (dto.organizationIds || []).map(id =>
          this.organizationUserMappingService.entityModel.create({
            organizationId: id,
          })
        ),
        userRoleMappings: (dto.roleIds || []).map(id =>
          this.userRoleMappingService.entityModel.create({
            roleId: id,
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
    // organization user mapping
    const removeOrganizationUserMappings = differenceWith(
      user.organizationUserMappings,
      dto.organizationIds,
      (a, b) => a.organizationId === b
    );
    await this.organizationUserMappingService.entityModel.remove(
      removeOrganizationUserMappings
    );
    user.organizationUserMappings = (dto.organizationIds || []).map(id =>
      this.organizationUserMappingService.entityModel.create({
        organizationId: id,
        userId: user.id,
      })
    );
    // user role mapping
    const removeUserRoleMappings = differenceWith(
      user.userRoleMappings,
      dto.roleIds,
      (a, b) => a.roleId === b
    );
    await this.userRoleMappingService.entityModel.remove(
      removeUserRoleMappings
    );
    user.userRoleMappings = (dto.roleIds || []).map(id =>
      this.userRoleMappingService.entityModel.create({
        roleId: id,
        userId: user.id,
      })
    );
    return await this.updateObject(user);
  }

  async importUserList(url) {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(url, {});
    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        if (row.number === 1) {
          continue;
        }
        const dto: CreateUserDTO = {
          description: '',
          email: '',
          enabled: false,
          name: '',
          options: undefined,
          organizationIds: [],
          password: '',
          realName: '',
          roleIds: [],
          tel: '',
          tenantId: '',
          type: '',
        };
        row.eachCell((cell, cellNumber) => {
          switch (cellNumber) {
            case 1:
              dto.name = cell.text;
              break;
            case 2:
              dto.password = cell.text;
              break;
            case 3:
              dto.tenantId = cell.text;
              break;
            case 4:
              dto.type = cell.text;
              break;
            case 5:
              dto.organizationIds = cell.text.split(',');
              break;
            case 6:
              dto.roleIds = cell.text.split(',');
              break;
          }
        });
        if (await this.checkNameExisted(dto.name)) {
          continue;
        }
        await this.createUser(dto);
      }
    }
  }

  addPasswordErrorNumber(count = 1) {
    const passwordErrorNumber = this.ctx.session.passwordErrorNumber || 0;
    this.ctx.session.passwordErrorNumber = passwordErrorNumber + count;
  }

  checkPasswordErrorNumber() {
    return this.ctx.session.passwordErrorNumber >= 5;
  }
}
