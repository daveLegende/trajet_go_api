import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CONVERSATION_REPOSITORY, ConversationRepositoryPort } from '../../domain/repositories/messagerie.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepositoryPort,
  ) {}

  async execute(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    const allParticipants = Array.from(new Set([userId, ...dto.participantIds]));
    
    if (allParticipants.length < 2) {
      throw new BadRequestException('Une conversation doit avoir au moins 2 participants distincts.');
    }

    // Check if a conversation already exists for these participants (without trajet context)
    // For simplicity, we just create it or maybe check. In a real app we might check if an exact match exists.
    // Let's check if it exists:
    if (!dto.trajetId) {
       const existing = await this.conversationRepository.findConversationByParticipants(allParticipants);
       if (existing) {
         return existing;
       }
    }

    return this.conversationRepository.createConversation(allParticipants, dto.trajetId);
  }
}
