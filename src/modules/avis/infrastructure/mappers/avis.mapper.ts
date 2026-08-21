import { AvisEntity } from '../../domain/entities/avis.entity';

export class AvisMapper {
  static toDomain(raw: any): AvisEntity {
    return new AvisEntity({
      id: raw.id,
      auteur_id: raw.auteur_id,
      cible_id: raw.cible_id,
      trajet_id: raw.trajet_id,
      note: raw.note,
      commentaire: raw.commentaire ?? null,
      date_creation: new Date(raw.date_creation),
    });
  }
}
