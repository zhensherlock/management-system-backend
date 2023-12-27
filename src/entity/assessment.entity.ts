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

@Entity({
  name: 'assessment',
})
export class AssessmentEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '考核编号' })
  id: string;

  @Column({ length: 191, comment: '考核标题' })
  title: string;

  @Column({
    name: 'parent_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '父级考核编号',
  })
  parentId: string;

  @Column({ default: 0, comment: '考核顺序' })
  sequence: number;

  @Column({
    name: 'score_type',
    length: 1,
    default: '1',
    comment: '考核分数类型',
  })
  scoreType: string;

  @Column({ name: 'maximum_score', comment: '考核分数上限' })
  maximumScore: number;

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

  @ManyToOne(() => AssessmentEntity, node => node.children)
  @JoinColumn({ name: 'parent_id' })
  parent: AssessmentEntity;

  @OneToMany(() => AssessmentEntity, node => node.parent)
  children: AssessmentEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
