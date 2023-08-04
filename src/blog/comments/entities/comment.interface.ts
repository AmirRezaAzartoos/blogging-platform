import { IPost } from 'src/blog/posts/entities/post.interface';
import { IUser } from 'src/users/entities/user.interface';
export interface IComment {
  id?: number;
  content: string;
  author?: IUser;
  publicationDate?: Date;
  post?: IPost;
}
