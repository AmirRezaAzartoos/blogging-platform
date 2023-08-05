import { CommentEntity } from '../../../blog/comments/entities/comment.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  author: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @Column('text', { array: true })
  tags: Array<string>;

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.post)
  comments: CommentEntity[];
}
