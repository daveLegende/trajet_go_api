import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.use-case';
import { ManageUserUseCase } from '../../application/use-cases/manage-user.use-case';
import { ResolveSignalementUseCase } from '../../application/use-cases/resolve-signalement.use-case';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Seuls les utilisateurs avec type_utilisateur = 'ADMIN' y auront accès
@Controller('admin')
export class AdminController {
  constructor(
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private readonly manageUserUseCase: ManageUserUseCase,
    private readonly resolveSignalementUseCase: ResolveSignalementUseCase,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques globales de la plateforme' })
  async getStats() {
    return this.getDashboardStatsUseCase.execute();
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Bannir (suspendre) un utilisateur' })
  async banUser(@Param('id') id: string) {
    await this.manageUserUseCase.ban(id);
    return { success: true, message: 'Utilisateur banni.' };
  }

  @Patch('users/:id/unban')
  @ApiOperation({ summary: 'Débannir (réactiver) un utilisateur' })
  async unbanUser(@Param('id') id: string) {
    await this.manageUserUseCase.unban(id);
    return { success: true, message: 'Utilisateur réactivé.' };
  }

  @Patch('signalements/:id/resolve')
  @ApiOperation({ summary: 'Marquer un signalement utilisateur comme résolu/rejeté' })
  async resolveSignalement(
    @Param('id') id: string,
    @Body() body: { statut: 'RESOLU' | 'REJETE' | 'EN_COURS' },
  ) {
    await this.resolveSignalementUseCase.executeSignalement(id, body.statut);
    return { success: true };
  }

  @Patch('sos/:id/resolve')
  @ApiOperation({ summary: 'Marquer une alerte SOS comme résolue' })
  async resolveSos(
    @Param('id') id: string,
    @Body() body: { statut: 'RESOLUE' | 'PRISE_EN_CHARGE' | 'FAUSSE_ALERTE' },
  ) {
    await this.resolveSignalementUseCase.executeSos(id, body.statut);
    return { success: true };
  }
}
