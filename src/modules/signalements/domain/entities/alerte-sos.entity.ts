export enum StatutAlerteSos {
  ACTIVE = 'ACTIVE',
  PRISE_EN_CHARGE = 'PRISE_EN_CHARGE',
  RESOLUE = 'RESOLUE',
  FAUSSE_ALERTE = 'FAUSSE_ALERTE',
}

export class AlerteSos {
  constructor(
    public readonly id: string,
    public readonly utilisateurId: string,
    public readonly trajetId: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly statut: StatutAlerteSos,
    public readonly dateCreation: Date,
    public readonly dateMiseAJour: Date,
  ) {}
}
