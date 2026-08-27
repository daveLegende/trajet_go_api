import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import {
  SignalementRepositoryPort,
  CreateSignalementInput,
} from '../../domain/repositories/signalements.repository';
import { Signalement, MotifSignalement, StatutSignalement } from '../../domain/entities/signalement.entity';

@Injectable()
export class PrismaSignalementRepository implements SignalementRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateSignalementInput): Promise<Signalement> {
    const raw = await this.prisma.signalement.create({
      data: {
        auteur_id: input.auteurId,
        cible_id: input.cibleId,
        motif: input.motif as any,
        trajet_id: input.trajetId,
        description: input.description,
      },
    });
    return this.toDomain(raw);
  }

  async findAll(): Promise<Signalement[]> {
    const raw = await this.prisma.signalement.findMany({
      orderBy: { date_creation: 'desc' },
    });
    return raw.map((r) => this.toDomain(r));
  }

  async findByAuteurId(auteurId: string): Promise<Signalement[]> {
    const raw = await this.prisma.signalement.findMany({
      where: { auteur_id: auteurId },
      orderBy: { date_creation: 'desc' },
    });
    return raw.map((r) => this.toDomain(r));
  }

  private toDomain(raw: any): Signalement {
    return new Signalement(
      raw.id,
      raw.auteur_id,
      raw.cible_id,
      raw.motif as MotifSignalement,
      raw.statut as StatutSignalement,
      raw.date_creation,
      raw.date_mise_a_jour,
      raw.trajet_id,
      raw.description,
    );
  }
}
