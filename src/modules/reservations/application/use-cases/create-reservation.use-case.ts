import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { RESERVATION_REPOSITORY, ReservationRepositoryInterface } from '../../domain/repositories/reservation.repository.interface';
import { TRAJET_REPOSITORY, TrajetRepositoryInterface } from '../../../trajets/domain/repositories/trajet.repository.interface';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { StatutReservation } from '../../domain/entities/reservation.entity';
import { TypeReservation } from '../../../trajets/domain/entities/trajet.entity';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepositoryInterface,
    @Inject(TRAJET_REPOSITORY)
    private readonly trajetRepository: TrajetRepositoryInterface,
  ) {}

  async execute(passager_id: string, dto: CreateReservationDto) {
    const trajet = await this.trajetRepository.findById(dto.trajet_id);
    if (!trajet) {
      throw new NotFoundException('Trajet introuvable');
    }

    if (trajet.conducteur_id === passager_id) {
      throw new BadRequestException('Vous ne pouvez pas réserver votre propre trajet');
    }

    if (trajet.places_disponibles < dto.nombre_places_reservees) {
      throw new BadRequestException('Pas assez de places disponibles');
    }

    let statut = StatutReservation.EN_ATTENTE;
    if (trajet.type_reservation === TypeReservation.INSTANT) {
      statut = StatutReservation.ACCEPTEE;
      await this.trajetRepository.update(trajet.id, {
        places_disponibles: trajet.places_disponibles - dto.nombre_places_reservees
      });
    }

    const montant_total = trajet.prix_par_place * dto.nombre_places_reservees;

    return this.reservationRepository.create({
      trajet_id: dto.trajet_id,
      passager_id,
      statut,
      places_reservees: dto.nombre_places_reservees,
      montant_total,
    });
  }
}
