import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { VerificationStatus } from '../../../users/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from '../../../users/domain/repositories/user.repository.interface';
import { UserMapper } from '../../../users/infrastructure/mappers/user.mapper';
import {
  OTP_REPOSITORY,
  OtpRepositoryInterface,
} from '../../domain/repositories/otp.repository.interface';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryInterface,
} from '../../domain/repositories/refresh-token.repository.interface';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: OtpRepositoryInterface,
    private readonly passwordHasher: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    // 1. Check if phone number was verified via OTP
    const latestOtp = await this.otpRepository.findLatestByCible(dto.telephone);
    if (!latestOtp || !latestOtp.verifie) {
      throw new BadRequestException(
        'Ce numéro de téléphone n’a pas été vérifié par code OTP. Veuillez d’abord valider votre numéro.',
      );
    }

    // 2. Check for unique email
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException(
        'Un compte avec cette adresse email existe déjà',
      );
    }

    // 3. Check for unique phone
    const existingPhone = await this.userRepository.findByPhone(dto.telephone);
    if (existingPhone) {
      throw new ConflictException(
        'Un compte avec ce numéro de téléphone existe déjà',
      );
    }

    const motDePasseHash = await this.passwordHasher.hash(dto.mot_de_passe);

    const user = await this.userRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      telephone: dto.telephone,
      mot_de_passe_hash: motDePasseHash,
      date_naissance: dto.date_naissance ? new Date(dto.date_naissance) : null,
      photo_profil_url: dto.photo_profil_url ?? null,
      type_utilisateur: dto.type_utilisateur,
      statut_verification: VerificationStatus.VERIFIE,
      langue_preferee: dto.langue_preferee ?? 'fr',
    });

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
