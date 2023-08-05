import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsEmail,
} from 'class-validator';
import { IPost } from '../../blog/posts/entities/post.interface';
import { Role } from '../entities/role.enum';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsDate()
  creationDate?: Date = new Date();

  role?: Role;

  @IsOptional()
  @IsArray()
  posts?: IPost[];
}
