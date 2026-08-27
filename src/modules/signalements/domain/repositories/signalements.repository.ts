import { Signalement, MotifSignalement } from '../entities/signalement.entity';
import { AlerteSos } from '../entities/alerte-sos.entity';

export const SIGNALEMENT_REPOSITORY = 'SignalementRepositoryPort';
export const ALERTE_SOS_REPOSITORY = 'AlerteSosRepositoryPort';

export interface CreateSignalementInput {
  auteurId: string;
  cibleId: string;
  motif: MotifSignalement;
  trajetId?: string;
  description?: string;
}

export interface SignalementRepositoryPort {
  create(input: CreateSignalementInput): Promise<Signalement>;
  findAll(): Promise<Signalement[]>; // Pour l'admin
  findByAuteurId(auteurId: string): Promise<Signalement[]>;
}

export interface CreateAlerteSosInput {
  utilisateurId: string;
  trajetId: string;
  latitude: number;
  longitude: number;
}

export interface AlerteSosRepositoryPort {
  create(input: CreateAlerteSosInput): Promise<AlerteSos>;
  findAllActive(): Promise<AlerteSos[]>; // Pour l'admin
}
