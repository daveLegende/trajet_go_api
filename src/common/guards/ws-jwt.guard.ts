import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    let token = client.handshake?.auth?.token;
    
    if (!token && client.handshake?.headers?.authorization) {
      token = client.handshake.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret') || process.env.JWT_SECRET,
      });
      client.user = payload;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }

    return true;
  }
}
