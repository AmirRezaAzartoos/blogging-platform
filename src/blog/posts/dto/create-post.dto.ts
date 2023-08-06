import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../../../users/entities/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post Title',
    example: 'Gaming platforms',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Post Content',
    example: 'There are multtiple platforms ...',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  author: IUser;

  @IsDate()
  publicationDate: Date = new Date();

  @ApiProperty({
    description: 'Post tags',
    example: ['tag 1', 'tag 2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: Array<string>;
}
