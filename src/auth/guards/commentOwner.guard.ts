import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CommentsService } from 'src/blog/comments/comments.service';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    return (
      (await this.commentsService.getComment(params.id)).author.id === user.id
    );
  }
}
