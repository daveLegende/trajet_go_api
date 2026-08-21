import { OtpEntity } from '../entities/otp.entity';

export const OTP_REPOSITORY = 'OTP_REPOSITORY';

export interface OtpRepositoryInterface {
  create(cible: string, codeHash: string, expiresAt: Date): Promise<OtpEntity>;
  findLatestByCible(cible: string): Promise<OtpEntity | null>;
  markAsVerified(id: string): Promise<void>;
}
