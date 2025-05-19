import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from '../types/jwt-user';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(_context: ExecutionContext) {
    return super.canActivate(_context);
  }

  handleRequest<TUser = JwtUser>(err: any, user: TUser) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
