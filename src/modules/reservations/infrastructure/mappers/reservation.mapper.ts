import { ReservationEntity, StatutReservation } from '../../domain/entities/reservation.entity';

export class ReservationMapper {
  static toDomain(raw: any): ReservationEntity {
    return new ReservationEntity({
      id: raw.id,
      trajet_id: raw.trajet_id,
      passager_id: raw.passager_id,
      statut: raw.statut as StatutReservation,
      places_reservees: raw.places_reservees,
      montant_total: Number(raw.montant_total),
      date_creation: raw.date_creation,
      date_mise_a_jour: raw.date_mise_a_jour,
    });
  }
}
