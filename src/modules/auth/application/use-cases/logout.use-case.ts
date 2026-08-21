import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from '../../../users/domain/repositories/user.repository.interface';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryInterface,
} from '../../domain/repositories/refresh-token.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    userId: string,
    refreshToken?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (refreshToken) {
      const hash = this.tokenService.hashToken(refreshToken);
      const token = await this.refreshTokenRepository.findByTokenHash(hash);
      if (token) {
        await this.refreshTokenRepository.revoke(token.id);
      }
    } else {
      await this.refreshTokenRepository.revokeAllForUser(userId);
    }

    // Invalidate any issued access tokens immediately
    await this.userRepository.updateLastLogout(userId);

    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  }
}
