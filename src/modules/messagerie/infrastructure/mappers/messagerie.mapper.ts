import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from '../../domain/entities/message.entity';

export class MessagerieMapper {
  static toConversationDomain(prismaData: any): Conversation {
    const participantIds = prismaData.participants ? prismaData.participants.map((p: any) => p.user_id) : [];
    return new Conversation(prismaData.id, participantIds, prismaData.date_creation, prismaData.date_mise_a_jour, prismaData.trajet_id);
  }
  static toMessageDomain(prismaData: any): Message {
    return new Message(prismaData.id, prismaData.conversation_id, prismaData.expediteur_id, prismaData.contenu, prismaData.lu, prismaData.date_creation, prismaData.date_lecture);
  }
}
