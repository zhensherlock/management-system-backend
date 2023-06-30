import { DeleteResult, UpdateResult, Repository, Not } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { isEmpty } from 'lodash';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export class BaseService<T> {
  entityModel: Repository<T | any>;

  fullSelects: string[];

  async getOneObject(options: FindOneOptions<T> = { where: {} }): Promise<T> {
    return await this.entityModel.findOne(options);
  }

  async getObjectById(id: string): Promise<T> {
    return await this.entityModel.findOne({
      where: {
        id,
      },
    });
  }

  async getFullObjectById(
    id: string,
    options: FindManyOptions<T> = {}
  ): Promise<T> {
    return await this.entityModel.findOne({
      select: this.fullSelects,
      where: {
        id,
      },
      ...options,
    });
  }

  async checkNameExisted(name: string, id?: string) {
    return await this.entityModel.exist({
      where: {
        name,
        ...(isEmpty(id) ? {} : { id: Not(id) }),
      },
    });
  }

  async exist(options?: FindManyOptions<T>) {
    return await this.entityModel.exist(options);
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
  ): Promise<[T[], number, number, number]> {
    return [
      ...(await this.entityModel.findAndCount({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        ...options,
      })),
      currentPage,
      pageSize,
    ];
  }

  async saveObject(entity: T): Promise<T> {
    if (this.entityModel.hasId(entity)) {
      return await this.updateObject(entity);
    } else {
      return await this.createObject(entity);
    }
  }

  async createObject(entity: T): Promise<T> {
    const mdl = this.entityModel.create();
    Object.assign(mdl, entity);
    return await this.entityModel.save(mdl);
  }

  async updateObjectById(id: string, entity: T): Promise<T> {
    const mdl = await this.getObjectById(id);
    Object.assign(mdl, entity);
    return await this.entityModel.save(mdl);
  }

  async updateObject(entity: T): Promise<T> {
    return await this.entityModel.save(entity);
  }

  async existObject(options?: FindManyOptions<T>): Promise<boolean> {
    return await this.entityModel.exist(options);
  }

  async existObjectById(id: string): Promise<boolean> {
    return await this.entityModel.exist({
      where: {
        id,
      },
    });
  }

  async deleteObject(id: string): Promise<DeleteResult> {
    return await this.entityModel.delete(id);
  }

  async deleteObjectAndRelation(id: string): Promise<DeleteResult> {
    return await this.entityModel.remove(await this.getObjectById(id));
  }

  async softDeleteObject(id: string): Promise<UpdateResult> {
    return await this.entityModel.softDelete(id);
  }

  async restoreDeleteObject(id: string): Promise<UpdateResult> {
    return await this.entityModel.restore(id);
  }
}
