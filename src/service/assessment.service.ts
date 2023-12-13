import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { AssessmentEntity } from '../entity/assessment.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';

@Provide()
export class AssessmentService extends BaseService<AssessmentEntity> {
  @InjectEntityModel(AssessmentEntity)
  entityModel: Repository<AssessmentEntity>;

  constructor() {
    super();
  }
}
