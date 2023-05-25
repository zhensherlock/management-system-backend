import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export class BaseService<T> {
  entityModel: Repository<T | any>;

  async getObjectById(id: string): Promise<T> {
    return await this.entityModel.findOne({
      where: {
        id,
      },
    });
  }

  async getCount(options?: FindManyOptions<T>): Promise<number> {
    return await this.entityModel.count(options);
  }

  async findAll(): Promise<T[]> {
    return this.entityModel.find();
  }

  async saveObject(entity: T): Promise<T> {
    if (this.entityModel.hasId(entity)) {
      return await this.updateObject(this.entityModel.getId(entity), entity);
    } else {
      return await this.createObject(entity);
    }
  }

  async createObject(entity: T): Promise<T> {
    const mdl = this.entityModel.create();
    Object.assign(mdl, entity);
    return this.entityModel.save(mdl);
  }

  async updateObject(id: string, entity: T): Promise<T> {
    await this.entityModel.update(id, entity);
    return this.getObjectById(id);
  }

  async deleteObject(id: string): Promise<void> {
    await this.entityModel.delete(id);
  }

  async softDeleteObject(id: string): Promise<void> {
    await this.entityModel.softDelete(id);
  }
}
