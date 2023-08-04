import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/users/entities/user.interface';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  author: IUser;

  @IsDate()
  publicationDate: Date = new Date();

  @IsArray()
  @IsString({ each: true })
  tags: Array<string>;
}
