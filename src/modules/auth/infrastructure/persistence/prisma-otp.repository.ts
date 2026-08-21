import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpRepositoryInterface } from '../../domain/repositories/otp.repository.interface';

@Injectable()
export class PrismaOtpRepository implements OtpRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    cible: string,
    codeHash: string,
    expiresAt: Date,
  ): Promise<OtpEntity> {
    const raw = await this.prisma.otpVerification.create({
      data: {
        cible: cible.trim(),
        code_hash: codeHash,
        expires_at: expiresAt,
      },
    });

    return new OtpEntity({
      id: raw.id,
      cible: raw.cible,
      code_hash: raw.code_hash,
      expires_at: raw.expires_at,
      verifie: raw.verifie,
      created_at: raw.created_at,
    });
  }

  async findLatestByCible(cible: string): Promise<OtpEntity | null> {
    const raw = await this.prisma.otpVerification.findFirst({
      where: { cible: cible.trim() },
      orderBy: { created_at: 'desc' },
    });

    if (!raw) return null;

    return new OtpEntity({
      id: raw.id,
      cible: raw.cible,
      code_hash: raw.code_hash,
      expires_at: raw.expires_at,
      verifie: raw.verifie,
      created_at: raw.created_at,
    });
  }

  async markAsVerified(id: string): Promise<void> {
    await this.prisma.otpVerification.update({
      where: { id },
      data: { verifie: true },
    });
  }
}
