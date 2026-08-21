import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpRepositoryInterface } from '../../domain/repositories/otp.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { SendOtpUseCase } from './send-otp.use-case';

describe('SendOtpUseCase', () => {
  let useCase: SendOtpUseCase;
  let otpRepository: jest.Mocked<OtpRepositoryInterface>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    otpRepository = {
      create: jest.fn().mockImplementation((cible, codeHash, expiresAt) =>
        Promise.resolve(
          new OtpEntity({
            id: 'otp-id-1',
            cible,
            code_hash: codeHash,
            expires_at: expiresAt,
            verifie: false,
            created_at: new Date(),
          }),
        ),
      ),
      findLatestByCible: jest.fn(),
      markAsVerified: jest.fn(),
    };

    tokenService = {
      hashToken: jest.fn().mockReturnValue('hashed_otp_code'),
    } as any;

    useCase = new SendOtpUseCase(otpRepository, tokenService);
  });

  it('should generate a 4-digit code and save hashed OTP in repository', async () => {
    const result = await useCase.execute({ cible: '+22890123456' });

    expect(result.success).toBe(true);
    expect(result.expires_at).toBeDefined();
    expect(otpRepository.create).toHaveBeenCalledWith(
      '+22890123456',
      'hashed_otp_code',
      expect.any(Date),
    );
  });
});
