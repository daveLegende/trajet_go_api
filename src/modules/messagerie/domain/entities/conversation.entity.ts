export class Conversation {
  constructor(
    public readonly id: string,
    public readonly participantIds: string[],
    public readonly dateCreation: Date,
    public readonly dateMiseAJour: Date,
    public readonly trajetId?: string,
  ) {}
}
