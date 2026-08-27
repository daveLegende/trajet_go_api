import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import {
  AlerteSosRepositoryPort,
  CreateAlerteSosInput,
} from '../../domain/repositories/signalements.repository';
import { AlerteSos, StatutAlerteSos } from '../../domain/entities/alerte-sos.entity';

@Injectable()
export class PrismaAlerteSosRepository implements AlerteSosRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAlerteSosInput): Promise<AlerteSos> {
    const raw = await this.prisma.alerteSos.create({
      data: {
        utilisateur_id: input.utilisateurId,
        trajet_id: input.trajetId,
        latitude: input.latitude,
        longitude: input.longitude,
      },
    });
    return this.toDomain(raw);
  }

  async findAllActive(): Promise<AlerteSos[]> {
    const raw = await this.prisma.alerteSos.findMany({
      where: { statut: 'ACTIVE' },
      orderBy: { date_creation: 'desc' },
    });
    return raw.map((r) => this.toDomain(r));
  }

  private toDomain(raw: any): AlerteSos {
    return new AlerteSos(
      raw.id,
      raw.utilisateur_id,
      raw.trajet_id,
      raw.latitude,
      raw.longitude,
      raw.statut as StatutAlerteSos,
      raw.date_creation,
      raw.date_mise_a_jour,
    );
  }
}
