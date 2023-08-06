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
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Enter first name',
    example: 'Amir',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Enter last name',
    example: 'Azar',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Enter email',
    example: 'Amir@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter password',
    example: 'password',
    required: true,
  })
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
