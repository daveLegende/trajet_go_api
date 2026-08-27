import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

export const CONVERSATION_REPOSITORY = 'ConversationRepositoryPort';
export const MESSAGE_REPOSITORY = 'MessageRepositoryPort';

export interface ConversationRepositoryPort {
  createConversation(participantIds: string[], trajetId?: string): Promise<Conversation>;
  findConversationById(id: string): Promise<Conversation | null>;
  findConversationByParticipants(participantIds: string[]): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<Conversation[]>;
}

export interface MessageRepositoryPort {
  createMessage(conversationId: string, expediteurId: string, contenu: string): Promise<Message>;
  findMessagesByConversationId(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;
}
