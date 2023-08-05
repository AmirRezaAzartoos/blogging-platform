import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Role } from '../entities/role.enum';
import { IPost } from '../../blog/posts/entities/post.interface';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  role?: Role;

  @IsOptional()
  @IsArray()
  posts?: IPost[];
}
