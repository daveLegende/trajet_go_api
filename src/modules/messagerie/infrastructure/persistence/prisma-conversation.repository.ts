import { Injectable } from '@nestjs/common';
import { ConversationRepositoryPort } from '../../domain/repositories/messagerie.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { MessagerieMapper } from '../mappers/messagerie.mapper';

@Injectable()
export class PrismaConversationRepository implements ConversationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(participantIds: string[], trajetId?: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.create({
      data: { trajet_id: trajetId, participants: { create: participantIds.map(id => ({ user_id: id })) } },
      include: { participants: true }
    });
    return MessagerieMapper.toConversationDomain(conversation);
  }

  async findConversationById(id: string): Promise<Conversation | null> {
    const conv = await this.prisma.conversation.findUnique({ where: { id }, include: { participants: true } });
    return conv ? MessagerieMapper.toConversationDomain(conv) : null;
  }

  async findConversationByParticipants(participantIds: string[]): Promise<Conversation | null> { return null; }

  async findConversationsByUserId(userId: string): Promise<Conversation[]> {
    const convs = await this.prisma.conversation.findMany({
      where: { participants: { some: { user_id: userId } } },
      include: { participants: true },
      orderBy: { date_mise_a_jour: 'desc' }
    });
    return convs.map(MessagerieMapper.toConversationDomain);
  }
}
