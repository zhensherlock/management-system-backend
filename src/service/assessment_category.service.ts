import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { AssessmentCategoryEntity } from '../entity/assessment_category.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class AssessmentCategoryService extends BaseService<AssessmentCategoryEntity> {
  @InjectEntityModel(AssessmentCategoryEntity)
  entityModel: Repository<AssessmentCategoryEntity>;

  constructor() {
    super();
  }
}
