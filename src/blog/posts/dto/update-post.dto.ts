import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { IUser } from 'src/users/entities/user.interface';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNotEmpty()
  author?: IUser;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: Array<string>;
}
