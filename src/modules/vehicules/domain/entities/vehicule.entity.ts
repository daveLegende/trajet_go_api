export enum VehiculeVerificationStatus {
  NON_VERIFIE = 'NON_VERIFIE',
  EN_ATTENTE = 'EN_ATTENTE',
  VERIFIE = 'VERIFIE',
  REJETE = 'REJETE',
}

export class VehiculeEntity {
  id: string;
  proprietaire_id: string;
  marque: string;
  modele: string;
  couleur: string;
  immatriculation: string;
  nombre_places: number;
  annee: number;
  carte_grise_url: string | null;
  assurance_url: string | null;
  date_expiration_assurance: Date | null;
  statut_verification: VehiculeVerificationStatus;
  photos: string[];
  date_creation: Date;
  date_mise_a_jour: Date;

  constructor(partial: Partial<VehiculeEntity>) {
    Object.assign(this, partial);
    if (!this.photos) {
      this.photos = [];
    }
  }

  isVerified(): boolean {
    return this.statut_verification === VehiculeVerificationStatus.VERIFIE;
  }
}
