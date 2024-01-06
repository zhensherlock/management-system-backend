import { Inject, Provide, MidwayConfigService, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { SystemConfigEntity } from '../entity/system_config.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class SystemConfigService extends BaseService<SystemConfigEntity> {
  private key = 'system_config';
  @Inject()
  configService: MidwayConfigService;

  @InjectEntityModel(SystemConfigEntity)
  entityModel: Repository<SystemConfigEntity>;

  @Inject()
  redisService: RedisService;

  @Config('redis.globalConfig')
  redisConfig;

  constructor() {
    super();
  }

  async getSystemConfig(): Promise<SystemConfigEntity> {
    let mdl: SystemConfigEntity;
    const redisKey = `${this.redisConfig.prefix}:${this.key}`;
    const exist = (await this.redisService.exists(redisKey)) === 1;
    if (exist) {
      mdl = JSON.parse(await this.redisService.get(redisKey));
    } else {
      mdl = await this.getOneObject();
      this.redisService.set(redisKey, JSON.stringify(mdl));
    }
    return mdl;
  }

  async updateSystemConfig(
    entity: SystemConfigEntity
  ): Promise<SystemConfigEntity> {
    const mdl = await this.getSystemConfig();
    Object.assign(mdl, entity);
    const result = await this.updateObject(mdl);
    const redisKey = `${this.redisConfig.prefix}:${this.key}`;
    this.redisService.del(redisKey);
    return result;
  }
}
