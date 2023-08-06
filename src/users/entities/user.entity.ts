import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from './role.enum';
import { PostEntity } from '../../blog/posts/entities/posts.entity';
import { CommentEntity } from '../../blog/comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity {
  @ApiProperty({
    description: 'Primary key as user ID',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User first name',
    example: 'Amir',
    type: String,
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Azar',
    type: String,
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'User email',
    example: 'amir@gmail.com',
    type: String,
  })
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
  })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({
    description: 'Date of User creation',
    example: new Date(),
    type: Date,
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate?: Date;

  // @ApiProperty({
  //   description: 'User posts',
  //   type: PostEntity,
  //   required: false,
  //   example: {
  //     id: 4,
  //     title: 'test3',
  //     content: 'test3',
  //     publicationDate: '2023-08-04T10:00:24.051Z',
  //     tags: ['test3'],
  //   },
  // })
  @OneToMany(() => PostEntity, (postEntity) => postEntity.author)
  posts?: PostEntity[];

  // @ApiProperty({
  //   description: 'User comments',
  //   type: CommentEntity,
  //   required: false,
  //   example: {
  //     id: 2,
  //     content: 'The movie was great (Updated)',
  //     publicationDate: '2023-08-04T16:28:50.134Z',
  //   },
  // })
  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.author)
  comments?: CommentEntity[];
}
