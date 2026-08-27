import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const totalUsers = await this.prisma.user.count();
    const totalTrajets = await this.prisma.trajet.count();
    const signalementsEnAttente = await this.prisma.signalement.count({ where: { statut: 'EN_ATTENTE' } });
    const sosActifs = await this.prisma.alerteSos.count({ where: { statut: 'ACTIVE' } });

    return {
      users: totalUsers,
      trajets: totalTrajets,
      signalementsEnAttente,
      sosActifs,
    };
  }
}
