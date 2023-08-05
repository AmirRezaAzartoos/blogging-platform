import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PostsService } from '../../blog/posts/posts.service';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    return (
      (await this.postsService.getPost(params.postId)).author.id === user.id
    );
  }
}
