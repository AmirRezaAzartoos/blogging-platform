import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Enter email',
    example: 'Amir@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter password',
    example: 'password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
