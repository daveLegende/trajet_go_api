import { UserRepositoryInterface } from '../../../users/domain/repositories/user.repository.interface';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepositoryInterface } from '../../domain/repositories/refresh-token.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { LogoutUseCase } from './logout.use-case';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepositoryInterface>;
  let tokenService: jest.Mocked<TokenService>;

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

    tokenService = {
      hashToken: jest.fn().mockReturnValue('hashed_token'),
    } as any;

    useCase = new LogoutUseCase(
      userRepository,
      refreshTokenRepository,
      tokenService,
    );
  });

  it('should revoke all tokens and update last logout timestamp', async () => {
    const result = await useCase.execute('user-uuid-1');

    expect(result.success).toBe(true);
    expect(refreshTokenRepository.revokeAllForUser).toHaveBeenCalledWith('user-uuid-1');
    expect(userRepository.updateLastLogout).toHaveBeenCalledWith('user-uuid-1');
  });

  it('should revoke specific token and update last logout timestamp', async () => {
    refreshTokenRepository.findByTokenHash.mockResolvedValue(
      new RefreshTokenEntity({
        id: 'token-uuid-1',
        user_id: 'user-uuid-1',
        token_hash: 'hashed_token',
        expires_at: new Date(),
        revoked: false,
        created_at: new Date(),
      }),
    );

    const result = await useCase.execute('user-uuid-1', 'specific-token');

    expect(result.success).toBe(true);
    expect(refreshTokenRepository.revoke).toHaveBeenCalledWith('token-uuid-1');
    expect(userRepository.updateLastLogout).toHaveBeenCalledWith('user-uuid-1');
  });
});
