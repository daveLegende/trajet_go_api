import { VehiculeEntity, VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import { VehiculeResponseDto } from '../../application/dto/vehicule-response.dto';

export class VehiculeMapper {
  static toDomain(raw: any): VehiculeEntity {
    return new VehiculeEntity({
      id: raw.id,
      proprietaire_id: raw.proprietaire_id,
      marque: raw.marque,
      modele: raw.modele,
      couleur: raw.couleur,
      immatriculation: raw.immatriculation,
      nombre_places: raw.nombre_places,
      annee: raw.annee,
      carte_grise_url: raw.carte_grise_url ?? null,
      assurance_url: raw.assurance_url ?? null,
      date_expiration_assurance: raw.date_expiration_assurance
        ? new Date(raw.date_expiration_assurance)
        : null,
      statut_verification: raw.statut_verification as VehiculeVerificationStatus,
      photos: raw.photos ?? [],
      date_creation: raw.date_creation,
      date_mise_a_jour: raw.date_mise_a_jour,
    });
  }

  static toResponseDto(entity: VehiculeEntity): VehiculeResponseDto {
    return {
      id: entity.id,
      proprietaire_id: entity.proprietaire_id,
      marque: entity.marque,
      modele: entity.modele,
      couleur: entity.couleur,
      immatriculation: entity.immatriculation,
      nombre_places: entity.nombre_places,
      annee: entity.annee,
      carte_grise_url: entity.carte_grise_url,
      assurance_url: entity.assurance_url,
      date_expiration_assurance: entity.date_expiration_assurance
        ? entity.date_expiration_assurance.toISOString()
        : null,
      statut_verification: entity.statut_verification,
      photos: entity.photos,
      date_creation: entity.date_creation.toISOString(),
      date_mise_a_jour: entity.date_mise_a_jour.toISOString(),
    };
  }
}
