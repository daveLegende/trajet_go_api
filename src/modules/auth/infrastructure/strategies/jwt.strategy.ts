import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from '../../../users/domain/repositories/user.repository.interface';
import { AccountStatus, UserEntity } from '../../../users/domain/entities/user.entity';
import { JwtPayload } from '../services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.accessSecret') ||
        'default-jwt-access-secret-min-32-chars-long!',
    });
  }

  async validate(
    payload: JwtPayload & { iat?: number },
  ): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'Utilisateur non reconnu ou session expirée',
      );
    }

    if (user.statut_compte !== AccountStatus.ACTIF) {
      throw new UnauthorizedException('Votre compte est suspendu ou supprimé');
    }

    if (user.date_derniere_deconnexion && payload.iat) {
      const logoutTimestampSec = Math.floor(
        user.date_derniere_deconnexion.getTime() / 1000,
      );
      if (payload.iat < logoutTimestampSec) {
        throw new UnauthorizedException(
          'Session terminée. Veuillez vous reconnecter.',
        );
      }
    }

    return user;
  }
}
