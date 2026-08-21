export enum StatutReservation {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  ANNULEE = 'ANNULEE'
}

export class ReservationEntity {
  id: string;
  trajet_id: string;
  passager_id: string;
  statut: StatutReservation;
  places_reservees: number;
  montant_total: number;
  date_creation: Date;
  date_mise_a_jour: Date;

  constructor(partial: Partial<ReservationEntity>) {
    Object.assign(this, partial);
  }
}
