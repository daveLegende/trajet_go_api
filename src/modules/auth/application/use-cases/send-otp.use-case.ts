import { Inject, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  OTP_REPOSITORY,
  OtpRepositoryInterface,
} from '../../domain/repositories/otp.repository.interface';
import { OtpResponseDto } from '../dto/otp-response.dto';
import { SendOtpDto } from '../dto/send-otp.dto';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class SendOtpUseCase {
  private readonly logger = new Logger(SendOtpUseCase.name);

  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: OtpRepositoryInterface,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: SendOtpDto): Promise<OtpResponseDto> {
    // Generate secure 4-digit numeric OTP (1000 - 9999)
    const code = crypto.randomInt(1000, 10000).toString();
    const codeHash = this.tokenService.hashToken(code);

    // 10 minutes validity
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.otpRepository.create(dto.cible, codeHash, expiresAt);

    this.logger.log(
      `[SIMULATION SMS/EMAIL OTP] Code généré pour ${dto.cible} : ${code} (expire à ${expiresAt.toISOString()})`,
    );

    const isProd = process.env.NODE_ENV === 'production';
    const message = isProd
      ? `Code OTP envoyé avec succès à ${dto.cible}`
      : `Code OTP envoyé avec succès à ${dto.cible} (Code de test : ${code})`;

    return {
      success: true,
      message,
      expires_at: expiresAt.toISOString(),
    };
  }
}
