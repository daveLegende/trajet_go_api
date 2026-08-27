import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';

@Injectable()
export class ResolveSignalementUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async executeSignalement(id: string, statut: 'RESOLU' | 'REJETE' | 'EN_COURS'): Promise<void> {
    const sig = await this.prisma.signalement.findUnique({ where: { id } });
    if (!sig) throw new NotFoundException('Signalement introuvable');

    await this.prisma.signalement.update({
      where: { id },
      data: { statut },
    });
  }

  async executeSos(id: string, statut: 'RESOLUE' | 'PRISE_EN_CHARGE' | 'FAUSSE_ALERTE'): Promise<void> {
    const sos = await this.prisma.alerteSos.findUnique({ where: { id } });
    if (!sos) throw new NotFoundException('Alerte SOS introuvable');

    await this.prisma.alerteSos.update({
      where: { id },
      data: { statut },
    });
  }
}
