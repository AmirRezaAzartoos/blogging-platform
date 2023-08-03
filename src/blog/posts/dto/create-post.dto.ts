import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsDate()
  publicationDate: Date = new Date();

  @IsArray()
  @IsString({ each: true })
  tags: Array<string>;
}
