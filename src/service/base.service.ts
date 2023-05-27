import { DeleteResult, UpdateResult, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

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

  async getSum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T>
  ): Promise<number> {
    return await this.entityModel.sum(columnName, where);
  }

  async getList(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entityModel.find(options);
  }

  async getListAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return await this.entityModel.findAndCount(options);
  }

  async getPaginatedList(
    currentPage = 1,
    pageSize = 20,
    options?: FindManyOptions<T>
  ): Promise<[T[], number]> {
    return await this.entityModel.findAndCount({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      ...options,
    });
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
    return await this.entityModel.save(mdl);
  }

  async updateObject(id: string, entity: T): Promise<T> {
    const mdl = await this.getObjectById(id);
    Object.assign(mdl, entity);
    return await this.entityModel.save(mdl);
  }

  async deleteObject(id: string): Promise<DeleteResult> {
    return await this.entityModel.delete(id);
  }

  async softDeleteObject(id: string): Promise<UpdateResult> {
    return await this.entityModel.softDelete(id);
  }
}
