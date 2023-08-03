import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UpdatePostDto {
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
  @IsString()
  author?: string;

  @IsOptional()
  @IsDate()
  publicationDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: Array<string>;
}
