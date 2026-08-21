import { AvisEntity } from '../entities/avis.entity';

export const AVIS_REPOSITORY = 'AVIS_REPOSITORY';

export interface CreateAvisData {
  auteur_id: string;
  cible_id: string;
  trajet_id: string;
  note: number;
  commentaire?: string;
}

export interface AvisRepositoryInterface {
  create(data: CreateAvisData): Promise<AvisEntity>;
  findByAuteurAndCibleAndTrajet(auteur_id: string, cible_id: string, trajet_id: string): Promise<AvisEntity | null>;
  findByCibleId(cible_id: string, page: number, limit: number): Promise<{ data: AvisEntity[]; total: number }>;
  getMoyenneAndCountForUser(cible_id: string): Promise<{ moyenne: number; count: number }>;
}
