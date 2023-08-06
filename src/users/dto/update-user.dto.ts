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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @ApiProperty({
    description: 'Enter first name',
    example: 'Amir',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Enter last name',
    example: 'Azar',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Enter email',
    example: 'Amir@gmail.com',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Enter password',
    example: 'password',
  })
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
