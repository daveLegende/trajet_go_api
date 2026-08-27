export enum MotifSignalement {
  COMPORTEMENT_INAPPROPRIE = 'COMPORTEMENT_INAPPROPRIE',
  CONDUITE_DANGEREUSE = 'CONDUITE_DANGEREUSE',
  RETARD_EXCESSIF = 'RETARD_EXCESSIF',
  AUTRE = 'AUTRE',
}

export enum StatutSignalement {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
  REJETE = 'REJETE',
}

export class Signalement {
  constructor(
    public readonly id: string,
    public readonly auteurId: string,
    public readonly cibleId: string,
    public readonly motif: MotifSignalement,
    public readonly statut: StatutSignalement,
    public readonly dateCreation: Date,
    public readonly dateMiseAJour: Date,
    public readonly trajetId?: string | null,
    public readonly description?: string | null,
  ) {}
}
