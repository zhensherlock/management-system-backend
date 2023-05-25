import { Repository } from 'typeorm';

export class BaseService<T> {
  entityModel: Repository<T | any>;

  async getObjectById(id: string): Promise<T> {
    return await this.entityModel.findOne({
      where: {
        id,
      },
    });
  }

  async getObjectList(): Promise<T[]> {
    return this.entityModel.find();
  }

  async findAll(): Promise<T[]> {
    return this.entityModel.find();
  }

  async saveObject(entity: T): Promise<T> {
    if (Object.prototype.hasOwnProperty.bind(entity, 'id')) {
      return await this.updateObject(entity['id'] as string, entity);
    } else {
      return await this.createObject(entity);
    }
  }

  async createObject(entity: T): Promise<T> {
    return this.entityModel.create(entity);
  }

  async updateObject(id: string, entity: T): Promise<T> {
    await this.entityModel.update(id, entity);
    return this.getObjectById(id);
  }

  async deleteObject(id: string): Promise<void> {
    await this.entityModel.delete(id);
  }
}
