import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Primary key as comment ID',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Comment Content',
    example: 'The movie was great.',
    type: String,
  })
  @Column()
  content: string;

  @ApiProperty({
    description: 'Comment Author',
    example: {
      creationDate: new Date(),
      firstName: 'B.firstName',
      lastName: 'B.lastName',
      email: 'B.email@gmail.com',
      id: 1,
      role: 'user',
    },
    type: UserEntity,
  })
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts)
  author: UserEntity;

  @ApiProperty({
    description: 'Post publication date',
    example: new Date(),
    type: Date,
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.comments)
  post: PostEntity;
}
