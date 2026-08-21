import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Accès refusé : utilisateur non authentifié');
    }

    const userType = user.type_utilisateur;

    // ADMIN has full access
    if (userType === 'ADMIN') {
      return true;
    }

    const hasRole = requiredRoles.some((role) => {
      const normalizedRole = role.toUpperCase();
      if (userType === normalizedRole) {
        return true;
      }
      // 'LES_DEUX' satisfies both PASSAGER and CONDUCTEUR
      if (
        userType === 'LES_DEUX' &&
        (normalizedRole === 'PASSAGER' || normalizedRole === 'CONDUCTEUR')
      ) {
        return true;
      }
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `Accès refusé : rôle(s) requis [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
