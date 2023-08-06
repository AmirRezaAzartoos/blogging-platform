import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { IUser } from '../../../users/entities/user.interface';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Post Title',
    example: 'Gaming platforms',
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Post Content',
    example: 'There are multtiple platforms ...',
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNotEmpty()
  author?: IUser;

  @ApiProperty({
    description: 'Post tags',
    example: ['tag 1', 'tag 2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: Array<string>;
}
