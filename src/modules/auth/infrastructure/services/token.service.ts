import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserEntity } from '../../../users/domain/entities/user.entity';

export interface GeneratedTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type_utilisateur: string;
}

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret =
      this.configService.get<string>('jwt.accessSecret') ||
      'default-jwt-access-secret-min-32-chars-long!';
    this.refreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'default-jwt-refresh-secret-min-32-chars-long!';
    this.accessExpiresIn =
      this.configService.get<string>('jwt.accessExpiresIn') || '15m';
    this.refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') || '7d';
  }

  async generateTokens(user: UserEntity): Promise<GeneratedTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type_utilisateur: user.type_utilisateur,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as any,
      }),
    ]);

    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in: 900,
    };
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.refreshSecret,
    });
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiryDate(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
  }
}
