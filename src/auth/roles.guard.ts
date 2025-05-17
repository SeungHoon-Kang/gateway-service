import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: { roles?: string[] } }>();
    const safeUser = user as { roles?: string[] }; // 타입 단언 추가
    return requiredRoles.some((role) => safeUser.roles?.includes(role));
  }
}
