import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/entities/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PostsService } from 'src/blog/posts/posts.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly postsService: PostsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    let variable: boolean;
    const { user, params } = context.switchToHttp().getRequest();

    // Checking post owner for changing post.
    if (['updatePost', 'deletePost'].includes(context.getHandler().name)) {
      variable =
        (await this.postsService.getPost(params.postId)).author.id === user.id;
    }

    // Checking user for changing information.
    if (['findOne', 'update', 'delete'].includes(context.getHandler().name)) {
      variable = user.id === params.id;
    }

    const roles = requiredRoles.some((role) => user.role?.includes(role));

    return roles || variable;
  }
}
