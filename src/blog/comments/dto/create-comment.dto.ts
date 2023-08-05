import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../../../users/entities/user.interface';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  author?: IUser;

  @IsDate()
  publicationDate?: Date = new Date();
}
