export enum TypeNotification {
  NOUVELLE_RESERVATION = 'NOUVELLE_RESERVATION',
  RESERVATION_ACCEPTEE = 'RESERVATION_ACCEPTEE',
  RESERVATION_REFUSEE = 'RESERVATION_REFUSEE',
  NOUVEAU_MESSAGE = 'NOUVEAU_MESSAGE',
  SYSTEME = 'SYSTEME',
}

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly titre: string,
    public readonly message: string,
    public readonly type: TypeNotification,
    public readonly lu: boolean,
    public readonly dateCreation: Date,
    public readonly donneesLiees?: Record<string, any> | null,
  ) {}
}
