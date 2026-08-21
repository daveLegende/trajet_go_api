import { PortefeuilleEntity } from '../entities/portefeuille.entity';

export const PORTEFEUILLE_REPOSITORY = 'PORTEFEUILLE_REPOSITORY';

export interface PortefeuilleRepositoryInterface {
  findByUserId(user_id: string): Promise<PortefeuilleEntity | null>;
  findOrCreateByUserId(user_id: string): Promise<PortefeuilleEntity>;
  updateSolde(id: string, newSolde: number): Promise<PortefeuilleEntity>;
  save(data: { user_id: string }): Promise<PortefeuilleEntity>;
}
