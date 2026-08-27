import { Injectable, Inject } from '@nestjs/common';
import { CONVERSATION_REPOSITORY, ConversationRepositoryPort } from '../../domain/repositories/messagerie.repository';

@Injectable()
export class GetConversationsUseCase {
  constructor(@Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepositoryPort) {}
  async execute(userId: string) { return this.conversationRepository.findConversationsByUserId(userId); }
}
