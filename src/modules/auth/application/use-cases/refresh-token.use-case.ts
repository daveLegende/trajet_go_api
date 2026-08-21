import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountStatus } from '../../../users/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from '../../../users/domain/repositories/user.repository.interface';
import { UserMapper } from '../../../users/infrastructure/mappers/user.mapper';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryInterface,
} from '../../domain/repositories/refresh-token.repository.interface';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload;
    try {
      payload = await this.tokenService.verifyRefreshToken(dto.refresh_token);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    const tokenHash = this.tokenService.hashToken(dto.refresh_token);
    const existingToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!existingToken || !existingToken.isValid()) {
      throw new UnauthorizedException(
        'Refresh token invalide, révoqué ou expiré',
      );
    }

    // Revoke old refresh token (Token rotation)
    await this.refreshTokenRepository.revoke(existingToken.id);

    const user = await this.userRepository.findById(payload.sub);
    if (!user || user.statut_compte !== AccountStatus.ACTIF) {
      throw new UnauthorizedException(
        'Utilisateur introuvable ou compte inactif',
      );
    }

    const newTokens = await this.tokenService.generateTokens(user);
    const newTokenHash = this.tokenService.hashToken(newTokens.refresh_token);
    const newExpiresAt = this.tokenService.getRefreshTokenExpiryDate();

    await this.refreshTokenRepository.create(
      user.id,
      newTokenHash,
      newExpiresAt,
    );

    return {
      ...newTokens,
      user: UserMapper.toResponseDto(user),
    };
  }
}
