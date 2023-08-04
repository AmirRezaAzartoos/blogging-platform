import { IUser } from 'src/users/entities/user.interface';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  author?: IUser;
  publicationDate?: Date;
  tags?: Array<string>;
}