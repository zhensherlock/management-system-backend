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
  generateUUID,
  updatedDateTransformer,
} from '../util';
import { UserEntity } from './user.entity';
import { AssessmentTaskDetailEntity } from './assessment_task_detail.entity';

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

  @Column({ type: 'json', nullable: true, comment: '考核项目' })
  content: object;

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
