import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RESERVATION_REPOSITORY, ReservationRepositoryInterface } from '../../domain/repositories/reservation.repository.interface';
import { TRAJET_REPOSITORY, TrajetRepositoryInterface } from '../../../trajets/domain/repositories/trajet.repository.interface';
import { StatutReservation } from '../../domain/entities/reservation.entity';

@Injectable()
export class RejectReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryInterface,
    @Inject(TRAJET_REPOSITORY)
    private readonly trajetRepository: TrajetRepositoryInterface,
  ) {}

  async execute(reservation_id: string, user_id: string) {
    const reservation = await this.reservationRepository.findById(reservation_id);
    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    const trajet = await this.trajetRepository.findById(reservation.trajet_id);
    if (!trajet) {
      throw new NotFoundException('Trajet introuvable');
    }

    if (trajet.conducteur_id !== user_id) {
      throw new ForbiddenException('Seul le conducteur peut refuser la réservation');
    }

    if (reservation.statut !== StatutReservation.EN_ATTENTE) {
      throw new BadRequestException('La réservation nest pas en attente');
    }

    return this.reservationRepository.updateStatut(reservation.id, StatutReservation.REFUSEE);
  }
}
