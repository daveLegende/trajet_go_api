import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UserResponseDto } from '../../application/dto/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil de l’utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur retourné avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié ou token expiré',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur introuvable',
  })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    return this.getUserProfileUseCase.execute(userId);
  }
}
