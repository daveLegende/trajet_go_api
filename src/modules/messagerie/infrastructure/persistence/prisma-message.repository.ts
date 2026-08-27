import { Injectable } from '@nestjs/common';
import { MessageRepositoryPort } from '../../domain/repositories/messagerie.repository';
import { Message } from '../../domain/entities/message.entity';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { MessagerieMapper } from '../mappers/messagerie.mapper';

@Injectable()
export class PrismaMessageRepository implements MessageRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async createMessage(conversationId: string, expediteurId: string, contenu: string): Promise<Message> {
    const message = await this.prisma.message.create({ data: { conversation_id: conversationId, expediteur_id: expediteurId, contenu } });
    await this.prisma.conversation.update({ where: { id: conversationId }, data: { date_mise_a_jour: new Date() } });
    return MessagerieMapper.toMessageDomain(message);
  }
  async findMessagesByConversationId(conversationId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({ where: { conversation_id: conversationId }, orderBy: { date_creation: 'asc' } });
    return messages.map(MessagerieMapper.toMessageDomain);
  }
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await this.prisma.message.updateMany({
      where: { conversation_id: conversationId, expediteur_id: { not: userId }, lu: false },
      data: { lu: true, date_lecture: new Date() }
    });
  }
}
