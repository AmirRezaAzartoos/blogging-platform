import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: 'Comment Content',
    example: 'The movie was great.',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;
}
