  import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

  @Injectable()
  export class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (user.role !== 'admin') {
        throw new ForbiddenException('No tienes permisos para acceder a esta ruta.');
      }

      return true;
    }
  }
