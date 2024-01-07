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
import { UserEntity } from './user.entity';
import { AssessmentTaskEntity } from './assessment_task.entity';
import { OrganizationEntity } from './organization.entity';
import { AssessmentTaskDetailStatus } from '../constant/assessment_task';

@Entity({
  name: 'assessment_task_detail',
})
export class AssessmentTaskDetailEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '考核任务详情编号' })
  id: string;

  @Column({
    name: 'assessment_task_id',
    length: 36,
    nullable: true,
    comment: '考核任务编号',
  })
  assessmentTaskId: string;

  @Column({
    name: 'creator_user_id',
    length: 36,
    nullable: true,
    comment: '发起用户编号',
  })
  creatorUserId: string;

  @Column({
    name: 'receive_school_organization_id',
    length: 36,
    nullable: true,
    comment: '接收任务学校组织编号',
  })
  receiveSchoolOrganizationId: string;

  @Column({
    default: AssessmentTaskDetailStatus.Pending,
    length: 40,
    comment: '考核任务详情状态',
  })
  status: string;

  @Column({
    name: 'submit_user_id',
    length: 36,
    nullable: true,
    comment: '发起用户编号',
  })
  addUserId: string;

  @Column({ type: 'json', nullable: true, comment: '考核项目' })
  assessment_content: object;

  @Column({ type: 'json', nullable: true, comment: '评分内容' })
  score_content: object;

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

  @ManyToOne(() => AssessmentTaskEntity, node => node.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_task_id' })
  assessmentTask: AssessmentTaskEntity;

  @ManyToOne(() => OrganizationEntity, node => node.receiveAssessmentDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receive_school_organization_id' })
  receiveSchoolOrganization: OrganizationEntity;

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}