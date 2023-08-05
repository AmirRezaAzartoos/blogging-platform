import { PostEntity } from '../../../blog/posts/entities/posts.entity';
import { UserEntity } from '../../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  author: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.comments)
  post: PostEntity;
}
