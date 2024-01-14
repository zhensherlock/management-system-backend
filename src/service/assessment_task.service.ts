import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import { AssessmentTaskEntity } from '../entity/assessment_task.entity';

@Provide()
export class AssessmentTaskService extends BaseService<AssessmentTaskEntity> {
  @InjectEntityModel(AssessmentTaskEntity)
  entityModel: Repository<AssessmentTaskEntity>;

  constructor() {
    super();
  }
}
