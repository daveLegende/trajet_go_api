import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { TrajetEntity, TrajetStatus, TypeReservation } from '../../domain/entities/trajet.entity';
import {
  CreateTrajetData,
  TrajetRepositoryInterface,
  UpdateTrajetData,
} from '../../domain/repositories/trajet.repository.interface';
import { TrajetMapper } from '../mappers/trajet.mapper';

@Injectable()
export class PrismaTrajetRepository implements TrajetRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTrajetData): Promise<TrajetEntity> {
    const record = await (this.prisma as any).trajet.create({
      data: {
        conducteur_id: data.conducteur_id,
        vehicule_id: data.vehicule_id,
        ville_depart: data.ville_depart,
        ville_arrivee: data.ville_arrivee,
        latitude_depart: data.latitude_depart,
        longitude_depart: data.longitude_depart,
        latitude_arrivee: data.latitude_arrivee,
        longitude_arrivee: data.longitude_arrivee,
        date_depart: data.date_depart,
        heure_depart: data.heure_depart,
        places_disponibles: data.places_disponibles,
        prix_par_place: data.prix_par_place,
        type_reservation: data.type_reservation,
        statut: data.statut ?? TrajetStatus.OUVERT,
        recurrence: data.recurrence ?? null,
        preferences: data.preferences ?? {},
        description: data.description ?? null,
      },
    });

    return TrajetMapper.toDomain(record);
  }

  async findById(id: string): Promise<TrajetEntity | null> {
    const record = await (this.prisma as any).trajet.findUnique({
      where: { id },
    });

    return record ? TrajetMapper.toDomain(record) : null;
  }

  async findMany(filters?: {
    ville_depart?: string;
    ville_arrivee?: string;
    date_depart?: Date;
    places_disponibles?: number;
    conducteur_id?: string;
  }): Promise<TrajetEntity[]> {
    const query: any = {
      where: {
        statut: {
          not: TrajetStatus.ANNULE,
        },
      },
    };

    if (filters?.ville_depart) {
      query.where.ville_depart = {
        contains: filters.ville_depart,
        mode: 'insensitive',
      };
    }

    if (filters?.ville_arrivee) {
      query.where.ville_arrivee = {
        contains: filters.ville_arrivee,
        mode: 'insensitive',
      };
    }

    if (filters?.date_depart) {
      query.where.date_depart = {
        gte: new Date(filters.date_depart),
      };
    }

    if (filters?.places_disponibles !== undefined) {
      query.where.places_disponibles = {
        gte: filters.places_disponibles,
      };
    }

    if (filters?.conducteur_id) {
      query.where.conducteur_id = filters.conducteur_id;
    }

    const records = await (this.prisma as any).trajet.findMany({
      ...query,
      orderBy: { date_depart: 'asc' },
    });

    return records.map((record: any) => TrajetMapper.toDomain(record));
  }

  async update(id: string, data: UpdateTrajetData): Promise<TrajetEntity> {
    const record = await (this.prisma as any).trajet.update({
      where: { id },
      data,
    });

    return TrajetMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await (this.prisma as any).trajet.delete({
      where: { id },
    });
  }
}
