import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY, MessageRepositoryPort, CONVERSATION_REPOSITORY, ConversationRepositoryPort } from '../../domain/repositories/messagerie.repository';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepositoryPort,
    @Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepositoryPort,
  ) {}
  async execute(userId: string, conversationId: string) {
    const conversation = await this.conversationRepository.findConversationById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation non trouvee');
    if (!conversation.participantIds.includes(userId)) throw new ForbiddenException('Acces refuse');
    return this.messageRepository.findMessagesByConversationId(conversationId);
  }
}
