import { UnauthorizedException } from '@nestjs/common';
import {
  AccountStatus,
  UserEntity,
  UserType,
  VerificationStatus,
} from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { RefreshTokenRepositoryInterface } from '../../domain/repositories/refresh-token.repository.interface';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let passwordHasher: jest.Mocked<PasswordHasherService>;
  let tokenService: jest.Mocked<TokenService>;

  const activeUser = new UserEntity({
    id: 'user-uuid-1',
    nom: 'Koffi',
    prenom: 'Abalo',
    email: 'koffi@example.com',
    telephone: '+22890123456',
    mot_de_passe_hash: 'hashed_pwd',
    date_naissance: null,
    photo_profil_url: null,
    type_utilisateur: UserType.PASSAGER,
    statut_verification: VerificationStatus.NON_VERIFIE,
    piece_identite_url: null,
    note_moyenne: 0.0,
    nombre_trajets: 0,
    langue_preferee: 'fr',
    statut_compte: AccountStatus.ACTIF,
    date_creation: new Date('2026-08-18T10:00:00.000Z'),
    date_derniere_connexion: null,
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
      updateFcmToken: jest.fn(),
    };

    refreshTokenRepository = {
      create: jest.fn(),
      findByTokenHash: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
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

    useCase = new LoginUseCase(
      userRepository,
      refreshTokenRepository,
      passwordHasher,
      tokenService,
    );
  });

  it('should login successfully with valid credentials and update last login', async () => {
    userRepository.findByEmailOrPhone.mockResolvedValue(activeUser);
    passwordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({
      identifier: 'koffi@example.com',
      mot_de_passe: 'Password123!',
    });

    expect(result.access_token).toBe('access.jwt.token');
    expect(result.user.email).toBe('koffi@example.com');
    expect(userRepository.updateLastLogin).toHaveBeenCalledWith('user-uuid-1');
    expect(refreshTokenRepository.create).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    userRepository.findByEmailOrPhone.mockResolvedValue(null);

    await expect(
      useCase.execute({
        identifier: 'unknown@example.com',
        mot_de_passe: 'pwd',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    userRepository.findByEmailOrPhone.mockResolvedValue(activeUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({
        identifier: 'koffi@example.com',
        mot_de_passe: 'wrong_pwd',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if account is suspended', async () => {
    const suspendedUser = new UserEntity({
      ...activeUser,
      statut_compte: AccountStatus.SUSPENDU,
    });
    userRepository.findByEmailOrPhone.mockResolvedValue(suspendedUser);
    passwordHasher.compare.mockResolvedValue(true);

    await expect(
      useCase.execute({
        identifier: 'koffi@example.com',
        mot_de_passe: 'pwd',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
