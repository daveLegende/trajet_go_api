import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import {
  AvisRepositoryInterface,
  CreateAvisData,
} from '../../domain/repositories/avis.repository.interface';
import { AvisEntity } from '../../domain/entities/avis.entity';
import { AvisMapper } from '../mappers/avis.mapper';

@Injectable()
export class PrismaAvisRepository implements AvisRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAvisData): Promise<AvisEntity> {
    const avis = await this.prisma.avis.create({
      data: {
        auteur_id: data.auteur_id,
        cible_id: data.cible_id,
        trajet_id: data.trajet_id,
        note: data.note,
        commentaire: data.commentaire,
      },
    });
    return AvisMapper.toDomain(avis);
  }

  async findByAuteurAndCibleAndTrajet(
    auteur_id: string,
    cible_id: string,
    trajet_id: string,
  ): Promise<AvisEntity | null> {
    const avis = await this.prisma.avis.findUnique({
      where: {
        auteur_id_cible_id_trajet_id: {
          auteur_id,
          cible_id,
          trajet_id,
        },
      },
    });
    return avis ? AvisMapper.toDomain(avis) : null;
  }

  async findByCibleId(
    cible_id: string,
    page: number,
    limit: number,
  ): Promise<{ data: AvisEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [avisRecords, total] = await this.prisma.$transaction([
      this.prisma.avis.findMany({
        where: { cible_id },
        orderBy: { date_creation: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.avis.count({ where: { cible_id } }),
    ]);

    return {
      data: avisRecords.map(AvisMapper.toDomain),
      total,
    };
  }

  async getMoyenneAndCountForUser(cible_id: string): Promise<{ moyenne: number; count: number }> {
    const result = await this.prisma.avis.aggregate({
      where: { cible_id },
      _avg: { note: true },
      _count: { id: true },
    });

    const moyenne = result._avg.note ? Number(result._avg.note.toFixed(2)) : 0;
    return {
      moyenne,
      count: result._count.id,
    };
  }
}
