import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CreerSignalementUseCase } from '../../application/use-cases/creer-signalement.use-case';
import { CreerSignalementDto } from '../../application/dto/creer-signalement.dto';

@ApiTags('Signalements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('signalements')
export class SignalementsController {
  constructor(private readonly creerSignalementUseCase: CreerSignalementUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Signaler un utilisateur' })
  async creerSignalement(@Request() req, @Body() dto: CreerSignalementDto) {
    return this.creerSignalementUseCase.execute({
      auteurId: req.user.userId,
      cibleId: dto.cibleId,
      motif: dto.motif,
      trajetId: dto.trajetId,
      description: dto.description,
    });
  }
}
