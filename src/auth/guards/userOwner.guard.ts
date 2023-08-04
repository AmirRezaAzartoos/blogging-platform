import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    return user.id === parseInt(params.id);
  }
}
