import { TrajetEntity, TrajetStatus, TypeReservation } from '../entities/trajet.entity';

export const TRAJET_REPOSITORY = 'TRAJET_REPOSITORY';

export interface CreateTrajetData {
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
  statut?: TrajetStatus;
  recurrence?: string | null;
  preferences?: Record<string, any>;
  description?: string | null;
}

export interface UpdateTrajetData {
  ville_depart?: string;
  ville_arrivee?: string;
  latitude_depart?: number;
  longitude_depart?: number;
  latitude_arrivee?: number;
  longitude_arrivee?: number;
  date_depart?: Date;
  heure_depart?: string;
  places_disponibles?: number;
  prix_par_place?: number;
  type_reservation?: TypeReservation;
  statut?: TrajetStatus;
  recurrence?: string | null;
  preferences?: Record<string, any>;
  description?: string | null;
}

export interface TrajetRepositoryInterface {
  create(data: CreateTrajetData): Promise<TrajetEntity>;
  findById(id: string): Promise<TrajetEntity | null>;
  findMany(filters?: {
    ville_depart?: string;
    ville_arrivee?: string;
    date_depart?: Date;
    places_disponibles?: number;
    conducteur_id?: string;
  }): Promise<TrajetEntity[]>;
  update(id: string, data: UpdateTrajetData): Promise<TrajetEntity>;
  delete(id: string): Promise<void>;
}
