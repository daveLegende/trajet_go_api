export enum UserType {
  PASSAGER = 'PASSAGER',
  CONDUCTEUR = 'CONDUCTEUR',
  LES_DEUX = 'LES_DEUX',
  ADMIN = 'ADMIN',
}

export enum VerificationStatus {
  NON_VERIFIE = 'NON_VERIFIE',
  EN_ATTENTE = 'EN_ATTENTE',
  VERIFIE = 'VERIFIE',
}

export enum AccountStatus {
  ACTIF = 'ACTIF',
  SUSPENDU = 'SUSPENDU',
  SUPPRIME = 'SUPPRIME',
}

export class UserEntity {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  mot_de_passe_hash: string;
  date_naissance: Date | null;
  photo_profil_url: string | null;
  type_utilisateur: UserType;
  statut_verification: VerificationStatus;
  piece_identite_url: string | null;
  note_moyenne: number;
  nombre_trajets: number;
  langue_preferee: string;
  statut_compte: AccountStatus;
  date_creation: Date;
  date_derniere_connexion: Date | null;
  date_derniere_deconnexion: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
