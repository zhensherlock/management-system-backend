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
import { AssessmentEntity } from './assessment.entity';

@Entity({
  name: 'assessment_category',
})
export class AssessmentCategoryEntity {
  @PrimaryColumn({ length: 36, type: 'uuid', comment: '考核类型编号' })
  id: string;

  @Column({ length: 191, comment: '考核类型名称' })
  name: string;

  @Column({
    name: 'parent_id',
    length: 36,
    type: 'uuid',
    nullable: true,
    comment: '父级考核类型编号',
  })
  parentId: string;

  @Column({ default: 0, comment: '考核类型顺序' })
  sequence: number;

  @Column({ length: 191, nullable: true, comment: '考核类型简介' })
  description: string;

  @Column({ default: true, comment: '考核类型是否可用' })
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

  @ManyToOne(() => AssessmentCategoryEntity, node => node.children)
  @JoinColumn({ name: 'parent_id' })
  parent: AssessmentCategoryEntity;

  @OneToMany(() => AssessmentCategoryEntity, node => node.parent)
  children: AssessmentCategoryEntity[];

  @OneToMany(() => AssessmentEntity, node => node.category)
  assessments: AssessmentEntity[];

  @BeforeInsert()
  generateId() {
    this.id = generateUUID();
  }
}
