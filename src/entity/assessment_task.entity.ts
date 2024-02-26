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
  OneToMany,
} from 'typeorm';
import {
  createDateTransformer,
  DecimalTransformer,
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { UserEntity } from './user.entity';
import { AssessmentTaskDetailEntity } from './assessment_task_detail.entity';
import { AssessmentTaskStatus } from '../constant';

@Entity({
  name: 'assessment_task',
})
export class AssessmentTaskEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '考核任务编号' })
  id: string;

  @Column({ length: 191, comment: '考核任务标题' })
  title: string;

  @Column({
    name: 'creator_user_id',
    length: 36,
    nullable: true,
    comment: '发起用户编号',
  })
  creatorUserId: string;

  @Column({ type: 'json', nullable: true, comment: '考核范围' })
  scope: object;

  @Column({ type: 'json', nullable: true, comment: '考核项目' })
  content: object;

  @Column({
    name: 'start_date',
    type: 'timestamp',
    comment: '开始时间',
    transformer: createDateTransformer,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp',
    comment: '结束时间',
    transformer: createDateTransformer,
  })
  endDate: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'basic_score',
    comment: '考核基础分',
    transformer: new DecimalTransformer(),
  })
  basicScore: number;

  @Column({
    name: 'grade_setting',
    type: 'json',
    nullable: true,
    comment: '分数等级配置',
  })
  gradeSetting: object;

  @Column({
    default: AssessmentTaskStatus.Draft,
    length: 40,
    comment: '考核任务状态',
  })
  status: string;

  @Column({ length: 191, nullable: true, comment: '考核任务简介' })
  description: string;

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

  @ManyToOne(() => UserEntity, node => node.createAssessmentTasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_user_id' })
  creatorUser: UserEntity;

  @OneToMany(() => AssessmentTaskDetailEntity, node => node.assessmentTask, {
    cascade: true,
  })
  details: AssessmentTaskDetailEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
