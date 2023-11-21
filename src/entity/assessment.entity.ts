import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  createDateTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { AssessmentCategoryEntity } from './assessment_category.entity';

@Entity({
  name: 'assessment',
})
export class AssessmentEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '考核编号' })
  id: string;

  @Column({ length: 191, comment: '考核标题' })
  title: string;

  @Column({
    name: 'assessment_category_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '所属考核类型编号',
  })
  assessmentCategoryId: string;

  @Column({ default: 0, comment: '考核顺序' })
  sequence: number;

  @Column({ length: 191, nullable: true, comment: '考核简介' })
  description: string;

  @Column({ default: true, comment: '考核是否可用' })
  enabled: boolean;

  @Column({ type: 'json', nullable: true, comment: '扩展配置信息' })
  options: object;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    comment: '添加时间',
    transformer: createDateTransformer,
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    nullable: true,
    comment: '修改时间',
    transformer: updatedDateTransformer,
  })
  updatedDate: Date;

  @DeleteDateColumn({
    name: 'deleted_date',
    type: 'timestamp',
    nullable: true,
    comment: '删除时间',
    select: false,
  })
  deletedDate: Date;

  @ManyToOne(() => AssessmentCategoryEntity, node => node.assessments)
  @JoinColumn({ name: 'module_id' })
  category: AssessmentCategoryEntity;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
