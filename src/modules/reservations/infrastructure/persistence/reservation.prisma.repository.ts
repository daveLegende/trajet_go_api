import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { ReservationRepositoryInterface, CreateReservationData } from '../../domain/repositories/reservation.repository.interface';
import { ReservationEntity, StatutReservation } from '../../domain/entities/reservation.entity';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class ReservationPrismaRepository implements ReservationRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReservationData): Promise<ReservationEntity> {
    const reservation = await this.prisma.reservation.create({
      data: {
        trajet_id: data.trajet_id,
        passager_id: data.passager_id,
        statut: data.statut as any,
        places_reservees: data.places_reservees,
        montant_total: data.montant_total,
      },
    });
    return ReservationMapper.toDomain(reservation);
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
    return reservation ? ReservationMapper.toDomain(reservation) : null;
  }

  async updateStatut(id: string, statut: StatutReservation): Promise<ReservationEntity> {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: { statut: statut as any },
    });
    return ReservationMapper.toDomain(reservation);
  }

  async findByPassagerId(passager_id: string): Promise<ReservationEntity[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { passager_id },
      orderBy: { date_creation: 'desc' },
    });
    return reservations.map(ReservationMapper.toDomain);
  }

  async findByTrajetId(trajet_id: string): Promise<ReservationEntity[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { trajet_id },
      orderBy: { date_creation: 'desc' },
    });
    return reservations.map(ReservationMapper.toDomain);
  }
}
