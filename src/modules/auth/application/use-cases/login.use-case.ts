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
import { LoginDto } from '../dto/login.dto';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmailOrPhone(dto.identifier);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const passwordValid = await this.passwordHasher.compare(
      dto.mot_de_passe,
      user.mot_de_passe_hash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    if (user.statut_compte !== AccountStatus.ACTIF) {
      throw new UnauthorizedException(
        'Votre compte est suspendu ou supprimé. Veuillez contacter le support.',
      );
    }

    await this.userRepository.updateLastLogin(user.id);

    const tokens = await this.tokenService.generateTokens(user);
    const tokenHash = this.tokenService.hashToken(tokens.refresh_token);
    const expiresAt = this.tokenService.getRefreshTokenExpiryDate();

    await this.refreshTokenRepository.create(user.id, tokenHash, expiresAt);

    return {
      ...tokens,
      user: UserMapper.toResponseDto(user),
    };
  }
}
