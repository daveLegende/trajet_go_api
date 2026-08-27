import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UpdateFcmTokenUseCase } from '../../application/use-cases/update-fcm-token.use-case';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { UpdateFcmTokenDto } from '../../application/dto/update-fcm-token.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateFcmTokenUseCase: UpdateFcmTokenUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur retourné avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Non authentifié ou token expiré' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    return this.getUserProfileUseCase.execute(userId);
  }

  @Patch('me/fcm-token')
  @ApiOperation({
    summary: 'Mettre à jour le token FCM pour les notifications push',
    description: 'Appelé par le client Flutter après connexion pour activer les notifications push Firebase.',
  })
  @ApiResponse({ status: 200, description: 'Token FCM mis à jour avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async updateFcmToken(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateFcmTokenDto,
  ): Promise<{ success: boolean }> {
    await this.updateFcmTokenUseCase.execute(userId, dto.fcmToken);
    return { success: true };
  }
}
