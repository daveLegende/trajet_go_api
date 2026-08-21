import {
  AccountStatus,
  UserEntity,
  UserType,
  VerificationStatus,
} from '../../domain/entities/user.entity';
import { UserResponseDto } from '../../application/dto/user-response.dto';

export class UserMapper {
  static toDomain(raw: any): UserEntity {
    return new UserEntity({
      id: raw.id,
      nom: raw.nom,
      prenom: raw.prenom,
      email: raw.email,
      telephone: raw.telephone,
      mot_de_passe_hash: raw.mot_de_passe_hash,
      date_naissance: raw.date_naissance ? new Date(raw.date_naissance) : null,
      photo_profil_url: raw.photo_profil_url ?? null,
      type_utilisateur: raw.type_utilisateur as UserType,
      statut_verification: raw.statut_verification as VerificationStatus,
      piece_identite_url: raw.piece_identite_url ?? null,
      note_moyenne: raw.note_moyenne ? Number(raw.note_moyenne) : 0,
      nombre_trajets: raw.nombre_trajets ?? 0,
      langue_preferee: raw.langue_preferee ?? 'fr',
      statut_compte: raw.statut_compte as AccountStatus,
      date_creation: raw.date_creation,
      date_derniere_connexion: raw.date_derniere_connexion
        ? new Date(raw.date_derniere_connexion)
        : null,
      date_derniere_deconnexion: raw.date_derniere_deconnexion
        ? new Date(raw.date_derniere_deconnexion)
        : null,
    });
  }

  static toResponseDto(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      nom: entity.nom,
      prenom: entity.prenom,
      email: entity.email,
      telephone: entity.telephone,
      date_naissance: entity.date_naissance
        ? entity.date_naissance.toISOString()
        : null,
      photo_profil_url: entity.photo_profil_url,
      type_utilisateur: entity.type_utilisateur,
      statut_verification: entity.statut_verification,
      piece_identite_url: entity.piece_identite_url,
      note_moyenne: entity.note_moyenne,
      nombre_trajets: entity.nombre_trajets,
      langue_preferee: entity.langue_preferee,
      statut_compte: entity.statut_compte,
      date_creation: entity.date_creation.toISOString(),
      date_derniere_connexion: entity.date_derniere_connexion
        ? entity.date_derniere_connexion.toISOString()
        : null,
    };
  }
}
