import { ReservationEntity, StatutReservation } from '../entities/reservation.entity';

export const RESERVATION_REPOSITORY = 'RESERVATION_REPOSITORY';

export interface CreateReservationData {
  trajet_id: string;
  passager_id: string;
  statut: StatutReservation;
  places_reservees: number;
  montant_total: number;
}

export interface ReservationRepositoryInterface {
  create(data: CreateReservationData): Promise<ReservationEntity>;
  findById(id: string): Promise<ReservationEntity | null>;
  updateStatut(id: string, statut: StatutReservation): Promise<ReservationEntity>;
  findByPassagerId(passager_id: string): Promise<ReservationEntity[]>;
  findByTrajetId(trajet_id: string): Promise<ReservationEntity[]>;
}
