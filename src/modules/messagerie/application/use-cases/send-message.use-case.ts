import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY, MessageRepositoryPort, CONVERSATION_REPOSITORY, ConversationRepositoryPort } from '../../domain/repositories/messagerie.repository';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepositoryPort,
    @Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepositoryPort,
  ) {}

  async execute(userId: string, dto: CreateMessageDto) {
    const conversation = await this.conversationRepository.findConversationById(dto.conversationId);
    if (!conversation) throw new NotFoundException('Conversation introuvable');
    if (!conversation.participantIds.includes(userId)) throw new ForbiddenException('Acces refuse');
    return this.messageRepository.createMessage(dto.conversationId, userId, dto.contenu);
  }
}
