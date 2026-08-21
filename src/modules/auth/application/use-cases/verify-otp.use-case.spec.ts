import { BadRequestException } from '@nestjs/common';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpRepositoryInterface } from '../../domain/repositories/otp.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { VerifyOtpUseCase } from './verify-otp.use-case';

describe('VerifyOtpUseCase', () => {
  let useCase: VerifyOtpUseCase;
  let otpRepository: jest.Mocked<OtpRepositoryInterface>;
  let tokenService: jest.Mocked<TokenService>;

  const validOtp = new OtpEntity({
    id: 'otp-id-1',
    cible: '+22890123456',
    code_hash: 'hashed_1234',
    expires_at: new Date(Date.now() + 1000 * 60 * 5),
    verifie: false,
    created_at: new Date(),
  });

  beforeEach(() => {
    otpRepository = {
      create: jest.fn(),
      findLatestByCible: jest.fn(),
      markAsVerified: jest.fn(),
    };

    tokenService = {
      hashToken: jest.fn().mockImplementation((code) => `hashed_${code}`),
    } as any;

    useCase = new VerifyOtpUseCase(otpRepository, tokenService);
  });

  it('should verify matching 4-digit OTP successfully', async () => {
    otpRepository.findLatestByCible.mockResolvedValue(validOtp);

    const result = await useCase.execute({
      cible: '+22890123456',
      code: '1234',
    });

    expect(result.success).toBe(true);
    expect(otpRepository.markAsVerified).toHaveBeenCalledWith('otp-id-1');
  });

  it('should throw BadRequestException if code does not match', async () => {
    otpRepository.findLatestByCible.mockResolvedValue(validOtp);

    await expect(
      useCase.execute({ cible: '+22890123456', code: '9999' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if OTP is expired', async () => {
    const expiredOtp = new OtpEntity({
      ...validOtp,
      expires_at: new Date(Date.now() - 10000),
    });
    otpRepository.findLatestByCible.mockResolvedValue(expiredOtp);

    await expect(
      useCase.execute({ cible: '+22890123456', code: '1234' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if OTP was already verified', async () => {
    const verifiedOtp = new OtpEntity({
      ...validOtp,
      verifie: true,
    });
    otpRepository.findLatestByCible.mockResolvedValue(verifiedOtp);

    await expect(
      useCase.execute({ cible: '+22890123456', code: '1234' }),
    ).rejects.toThrow(BadRequestException);
  });
});
