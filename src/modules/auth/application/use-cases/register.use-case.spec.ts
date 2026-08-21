import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  AccountStatus,
  UserEntity,
  UserType,
  VerificationStatus,
} from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpRepositoryInterface } from '../../domain/repositories/otp.repository.interface';
import { RefreshTokenRepositoryInterface } from '../../domain/repositories/refresh-token.repository.interface';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';
import { RegisterUseCase } from './register.use-case';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let otpRepository: jest.Mocked<OtpRepositoryInterface>;
  let passwordHasher: jest.Mocked<PasswordHasherService>;
  let tokenService: jest.Mocked<TokenService>;

  const registerDto = {
    nom: 'Koffi',
    prenom: 'Abalo',
    email: 'koffi@example.com',
    telephone: '+22890123456',
    mot_de_passe: 'Password123!',
    type_utilisateur: UserType.PASSAGER,
  };

  const verifiedOtp = new OtpEntity({
    id: 'otp-id-1',
    cible: '+22890123456',
    code_hash: 'hashed_otp',
    expires_at: new Date(Date.now() + 1000 * 60 * 10),
    verifie: true,
    created_at: new Date(),
  });

  const createdUser = new UserEntity({
    id: 'user-uuid-1',
    nom: 'Koffi',
    prenom: 'Abalo',
    email: 'koffi@example.com',
    telephone: '+22890123456',
    mot_de_passe_hash: 'hashed_pwd',
    date_naissance: null,
    photo_profil_url: null,
    type_utilisateur: UserType.PASSAGER,
    statut_verification: VerificationStatus.VERIFIE,
    piece_identite_url: null,
    note_moyenne: 0.0,
    nombre_trajets: 0,
    langue_preferee: 'fr',
    statut_compte: AccountStatus.ACTIF,
    date_creation: new Date('2026-08-18T10:00:00.000Z'),
    date_derniere_connexion: null,
    date_derniere_deconnexion: null,
  });

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findByEmailOrPhone: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateLastLogin: jest.fn(),
      updateLastLogout: jest.fn(),
    };

    refreshTokenRepository = {
      create: jest.fn(),
      findByTokenHash: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };

    otpRepository = {
      create: jest.fn(),
      findLatestByCible: jest.fn(),
      markAsVerified: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed_pwd'),
      compare: jest.fn(),
    } as any;

    tokenService = {
      generateTokens: jest.fn().mockResolvedValue({
        access_token: 'access.jwt.token',
        refresh_token: 'refresh.jwt.token',
        token_type: 'Bearer',
        expires_in: 900,
      }),
      hashToken: jest.fn().mockReturnValue('hashed_refresh_token'),
      getRefreshTokenExpiryDate: jest.fn().mockReturnValue(new Date('2026-08-25T10:00:00.000Z')),
      verifyRefreshToken: jest.fn(),
    } as any;

    useCase = new RegisterUseCase(
      userRepository,
      refreshTokenRepository,
      otpRepository,
      passwordHasher,
      tokenService,
    );
  });

  it('should successfully register when phone is verified via OTP', async () => {
    otpRepository.findLatestByCible.mockResolvedValue(verifiedOtp);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByPhone.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(createdUser);

    const result = await useCase.execute(registerDto);

    expect(result.access_token).toBe('access.jwt.token');
    expect(result.refresh_token).toBe('refresh.jwt.token');
    expect(result.user.email).toBe('koffi@example.com');
    expect(userRepository.create).toHaveBeenCalled();
    expect(refreshTokenRepository.create).toHaveBeenCalledWith(
      'user-uuid-1',
      'hashed_refresh_token',
      expect.any(Date),
    );
  });

  it('should throw BadRequestException if phone number is NOT verified via OTP', async () => {
    otpRepository.findLatestByCible.mockResolvedValue(null);

    await expect(useCase.execute(registerDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if OTP exists but is NOT marked as verified', async () => {
    const unverifiedOtp = new OtpEntity({
      ...verifiedOtp,
      verifie: false,
    });
    otpRepository.findLatestByCible.mockResolvedValue(unverifiedOtp);

    await expect(useCase.execute(registerDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw ConflictException if email is already taken', async () => {
    otpRepository.findLatestByCible.mockResolvedValue(verifiedOtp);
    userRepository.findByEmail.mockResolvedValue(createdUser);

    await expect(useCase.execute(registerDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw ConflictException if phone number is already taken', async () => {
    otpRepository.findLatestByCible.mockResolvedValue(verifiedOtp);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByPhone.mockResolvedValue(createdUser);

    await expect(useCase.execute(registerDto)).rejects.toThrow(
      ConflictException,
    );
  });
});
