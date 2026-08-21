import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepositoryInterface } from '../../domain/repositories/refresh-token.repository.interface';

@Injectable()
export class PrismaRefreshTokenRepository
  implements RefreshTokenRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshTokenEntity> {
    const raw = await this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });

    return new RefreshTokenEntity({
      id: raw.id,
      user_id: raw.user_id,
      token_hash: raw.token_hash,
      expires_at: raw.expires_at,
      revoked: raw.revoked,
      created_at: raw.created_at,
    });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const raw = await this.prisma.refreshToken.findFirst({
      where: { token_hash: tokenHash },
    });

    if (!raw) return null;

    return new RefreshTokenEntity({
      id: raw.id,
      user_id: raw.user_id,
      token_hash: raw.token_hash,
      expires_at: raw.expires_at,
      revoked: raw.revoked,
      created_at: raw.created_at,
    });
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { user_id: userId, revoked: false },
      data: { revoked: true },
    });
  }
}
