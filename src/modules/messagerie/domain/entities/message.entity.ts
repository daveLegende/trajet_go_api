export class Message {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly expediteurId: string,
    public readonly contenu: string,
    public readonly lu: boolean,
    public readonly dateCreation: Date,
    public readonly dateLecture?: Date,
  ) {}
}
