import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RESERVATION_REPOSITORY, ReservationRepositoryInterface } from '../../domain/repositories/reservation.repository.interface';
import { TRAJET_REPOSITORY, TrajetRepositoryInterface } from '../../../trajets/domain/repositories/trajet.repository.interface';
import { StatutReservation } from '../../domain/entities/reservation.entity';

@Injectable()
export class CancelReservationUseCase {
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

    if (reservation.passager_id !== user_id) {
      throw new ForbiddenException('Seul le passager peut annuler sa réservation');
    }

    if (reservation.statut === StatutReservation.ANNULEE || reservation.statut === StatutReservation.REFUSEE) {
      throw new BadRequestException('Réservation déjà annulée ou refusée');
    }

    if (reservation.statut === StatutReservation.ACCEPTEE) {
      const trajet = await this.trajetRepository.findById(reservation.trajet_id);
      if (trajet) {
        await this.trajetRepository.update(trajet.id, {
          places_disponibles: trajet.places_disponibles + reservation.places_reservees
        });
      }
    }

    return this.reservationRepository.updateStatut(reservation.id, StatutReservation.ANNULEE);
  }
}
