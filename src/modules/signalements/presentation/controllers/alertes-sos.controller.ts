import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { DeclencherSosUseCase } from '../../application/use-cases/declencher-sos.use-case';
import { DeclencherSosDto } from '../../application/dto/declencher-sos.dto';

@ApiTags('SOS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sos')
export class AlertesSosController {
  constructor(private readonly declencherSosUseCase: DeclencherSosUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Déclencher une alerte SOS en cas de danger' })
  async declencherSos(@Request() req, @Body() dto: DeclencherSosDto) {
    return this.declencherSosUseCase.execute({
      utilisateurId: req.user.userId,
      trajetId: dto.trajetId,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
  }
}
