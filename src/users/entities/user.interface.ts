import { IPost } from 'src/blog/posts/entities/post.interface';
import { Role } from './role.enum';

export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  creationDate: Date;
  role: Role;
  posts?: IPost[];
}
