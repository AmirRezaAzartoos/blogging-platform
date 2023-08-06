import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Primary key as post ID',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Post Title',
    example: 'Gaming platforms',
    type: String,
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Post Content',
    example: 'There are multtiple platforms ...',
    type: String,
  })
  @Column()
  content: string;

  @ApiProperty({
    description: 'Post Author',
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
  author?: UserEntity;

  @ApiProperty({
    description: 'Post publication date',
    example: new Date(),
    type: Date,
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publicationDate?: Date;

  @ApiProperty({
    description: 'Post tags',
    example: ['tag 1', 'tag 2'],
    type: [String],
  })
  @Column('text', { array: true })
  tags: Array<string>;

  @ApiProperty({
    description: 'Post comments',
    example: [
      {
        id: 2,
        content: 'The movie was great (Updated)',
        publicationDate: '2023-08-04T16:28:50.134Z',
      },
    ],
    type: [CommentEntity],
  })
  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.post)
  comments?: CommentEntity[];
}
