import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../../../users/entities/user.interface';
import { PostEntity } from '../../posts/entities/posts.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment Content',
    example: 'The movie was great.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  author?: IUser;

  @IsDate()
  publicationDate?: Date = new Date();

  @ApiProperty({
    description: 'Parent Post',
    type: PostEntity,
    required: false,
    example: {
      id: 4,
      title: 'test3',
      content: 'test3',
      publicationDate: new Date(),
      tags: ['test3'],
    },
  })
  post: PostEntity;
}
