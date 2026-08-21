import { VehiculeEntity, VehiculeVerificationStatus } from '../entities/vehicule.entity';

export const VEHICULE_REPOSITORY = 'VEHICULE_REPOSITORY';

export interface CreateVehiculeData {
  proprietaire_id: string;
  marque: string;
  modele: string;
  couleur: string;
  immatriculation: string;
  nombre_places: number;
  annee: number;
  carte_grise_url?: string | null;
  assurance_url?: string | null;
  date_expiration_assurance?: Date | null;
  photos?: string[];
}

export interface UpdateVehiculeData {
  marque?: string;
  modele?: string;
  couleur?: string;
  nombre_places?: number;
  annee?: number;
  carte_grise_url?: string | null;
  assurance_url?: string | null;
  date_expiration_assurance?: Date | null;
  statut_verification?: VehiculeVerificationStatus;
  photos?: string[];
}

export interface VehiculeRepositoryInterface {
  create(data: CreateVehiculeData): Promise<VehiculeEntity>;
  findById(id: string): Promise<VehiculeEntity | null>;
  findByImmatriculation(immatriculation: string): Promise<VehiculeEntity | null>;
  findByProprietaireId(proprietaireId: string): Promise<VehiculeEntity[]>;
  update(id: string, data: UpdateVehiculeData): Promise<VehiculeEntity>;
  delete(id: string): Promise<void>;
}
