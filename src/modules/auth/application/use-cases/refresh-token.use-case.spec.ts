import { UnauthorizedException } from '@nestjs/common';
import {
  AccountStatus,
  UserEntity,
  UserType,
  VerificationStatus,
} from '../../../users/domain/entities/user.entity';
import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepositoryInterface } from '../../domain/repositories/refresh-token.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { RefreshTokenUseCase } from './refresh-token.use-case';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
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

  const validToken = new RefreshTokenEntity({
    id: 'token-uuid-1',
    user_id: 'user-uuid-1',
    token_hash: 'hashed_raw_token',
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
    revoked: false,
    created_at: new Date(),
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
    } as any;

    refreshTokenRepository = {
      create: jest.fn(),
      findByTokenHash: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };

    tokenService = {
      generateTokens: jest.fn().mockResolvedValue({
        access_token: 'new.access.token',
        refresh_token: 'new.refresh.token',
        token_type: 'Bearer',
        expires_in: 900,
      }),
      hashToken: jest.fn().mockReturnValue('hashed_raw_token'),
      getRefreshTokenExpiryDate: jest.fn().mockReturnValue(new Date('2026-08-25T10:00:00.000Z')),
      verifyRefreshToken: jest.fn().mockResolvedValue({
        sub: 'user-uuid-1',
        email: 'koffi@example.com',
        type_utilisateur: 'PASSAGER',
      }),
    } as any;

    useCase = new RefreshTokenUseCase(
      userRepository,
      refreshTokenRepository,
      tokenService,
    );
  });

  it('should rotate refresh token and issue new pair of tokens', async () => {
    refreshTokenRepository.findByTokenHash.mockResolvedValue(validToken);
    userRepository.findById.mockResolvedValue(activeUser);

    const result = await useCase.execute({
      refresh_token: 'valid.raw.refresh.token',
    });

    expect(result.access_token).toBe('new.access.token');
    expect(result.refresh_token).toBe('new.refresh.token');
    expect(refreshTokenRepository.revoke).toHaveBeenCalledWith('token-uuid-1');
    expect(refreshTokenRepository.create).toHaveBeenCalledWith(
      'user-uuid-1',
      'hashed_raw_token',
      expect.any(Date),
    );
  });

  it('should throw UnauthorizedException if refresh token in DB is revoked', async () => {
    const revokedToken = new RefreshTokenEntity({
      ...validToken,
      revoked: true,
    });
    refreshTokenRepository.findByTokenHash.mockResolvedValue(revokedToken);

    await expect(
      useCase.execute({ refresh_token: 'revoked.token' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    tokenService.verifyRefreshToken.mockRejectedValue(new Error('Invalid signature'));

    await expect(
      useCase.execute({ refresh_token: 'invalid.token' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
