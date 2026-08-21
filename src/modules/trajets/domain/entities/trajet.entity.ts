export enum TypeReservation {
  INSTANT = 'INSTANT',
  AVEC_APPROBATION = 'AVEC_APPROBATION',
}

export enum TrajetStatus {
  OUVERT = 'OUVERT',
  COMPLET = 'COMPLET',
  ANNULE = 'ANNULE',
  TERMINE = 'TERMINE',
}

export class TrajetEntity {
  id: string;
  conducteur_id: string;
  vehicule_id: string;
  ville_depart: string;
  ville_arrivee: string;
  latitude_depart: number;
  longitude_depart: number;
  latitude_arrivee: number;
  longitude_arrivee: number;
  date_depart: Date;
  heure_depart: string;
  places_disponibles: number;
  prix_par_place: number;
  type_reservation: TypeReservation;
  statut: TrajetStatus;
  recurrence: string | null;
  preferences: Record<string, any>;
  description?: string | null;
  date_creation: Date;
  date_mise_a_jour: Date;

  constructor(partial: Partial<TrajetEntity>) {
    Object.assign(this, partial);
    if (!this.preferences) {
      this.preferences = {};
    }
  }

  isOpen(): boolean {
    return this.statut === TrajetStatus.OUVERT;
  }
}
