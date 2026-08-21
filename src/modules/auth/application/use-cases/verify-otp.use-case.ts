import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  OTP_REPOSITORY,
  OtpRepositoryInterface,
} from '../../domain/repositories/otp.repository.interface';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: OtpRepositoryInterface,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    dto: VerifyOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const otp = await this.otpRepository.findLatestByCible(dto.cible);

    if (!otp || !otp.isValid()) {
      throw new BadRequestException('Code OTP invalide ou expiré');
    }

    const inputHash = this.tokenService.hashToken(dto.code);
    if (inputHash !== otp.code_hash) {
      throw new BadRequestException('Code OTP incorrect');
    }

    await this.otpRepository.markAsVerified(otp.id);

    return {
      success: true,
      message: 'Numéro de téléphone / email vérifié avec succès',
    };
  }
}
