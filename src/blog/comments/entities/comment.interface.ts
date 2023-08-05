import { IPost } from '../../../blog/posts/entities/post.interface';
import { IUser } from '../../../users/entities/user.interface';
export interface IComment {
  id?: number;
  content: string;
  author?: IUser;
  publicationDate?: Date;
  post?: IPost;
}
