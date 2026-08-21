import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Public } from '../../../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { OtpResponseDto } from '../../application/dto/otp-response.dto';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { SendOtpDto } from '../../application/dto/send-otp.dto';
import { VerifyOtpDto } from '../../application/dto/verify-otp.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { SendOtpUseCase } from '../../application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
  ) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscription d’un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Compte créé avec succès',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données d’entrée non valides',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ou numéro de téléphone déjà utilisé',
  })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion par email ou téléphone' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides ou compte inactif',
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir l’access token via le refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Nouveaux tokens générés avec succès',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalide, expiré ou révoqué',
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnexion (invalidation des refresh tokens)' })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion effectuée avec succès',
  })
  async logout(
    @CurrentUser('id') userId: string,
    @Body() body?: { refresh_token?: string },
  ): Promise<{ success: boolean; message: string }> {
    return this.logoutUseCase.execute(userId, body?.refresh_token);
  }

  @Public()
  @Post('otp/send')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Générer et envoyer un code OTP (4 chiffres)' })
  @ApiResponse({
    status: 200,
    description: 'Code OTP généré',
    type: OtpResponseDto,
  })
  async sendOtp(@Body() dto: SendOtpDto): Promise<OtpResponseDto> {
    return this.sendOtpUseCase.execute(dto);
  }

  @Public()
  @Post('otp/verify')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier un code OTP à 4 chiffres' })
  @ApiResponse({
    status: 200,
    description: 'Code vérifié avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Code incorrect ou expiré',
  })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.verifyOtpUseCase.execute(dto);
  }
}
