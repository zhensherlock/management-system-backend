import { Inject, Provide, MidwayConfigService, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { SystemConfig } from '../entity/system_config.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class SystemConfigService extends BaseService<SystemConfig> {
  private key = 'system_config';
  @Inject()
  configService: MidwayConfigService;

  @InjectEntityModel(SystemConfig)
  entityModel: Repository<SystemConfig>;

  @Inject()
  redisService: RedisService;

  @Config('redis.globalConfig')
  redisConfig;

  constructor() {
    super();
  }

  async getSystemConfig(): Promise<SystemConfig> {
    let mdl: SystemConfig;
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

  async updateSystemConfig(entity: SystemConfig): Promise<SystemConfig> {
    const mdl = await this.getSystemConfig();
    const result = await this.updateObject(mdl.id, entity);
    const redisKey = `${this.redisConfig.prefix}:${this.key}`;
    this.redisService.del(redisKey);
    return result;
  }
}
