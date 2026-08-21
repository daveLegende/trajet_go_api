import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';

export class PortefeuilleMapper {
  static toDomain(raw: any): PortefeuilleEntity {
    return new PortefeuilleEntity({
      id: raw.id,
      user_id: raw.user_id,
      solde: Number(raw.solde),
      date_creation: new Date(raw.date_creation),
      date_mise_a_jour: new Date(raw.date_mise_a_jour),
    });
  }
}
