import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { authorization } = context
      .switchToHttp()
      .getRequest<Request>().headers;

    const request = context.switchToHttp().getRequest<any>();

    try {
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      request.tokenPayload = data;

      request.user = await this.userService.readOne(data.id);

      return true;
    } catch {
      return false;
    }
  }
}
