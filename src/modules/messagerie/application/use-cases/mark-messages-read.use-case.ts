import { Injectable, Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY, MessageRepositoryPort } from '../../domain/repositories/messagerie.repository';

@Injectable()
export class MarkMessagesAsReadUseCase {
  constructor(@Inject(MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepositoryPort) {}
  async execute(userId: string, conversationId: string) { await this.messageRepository.markMessagesAsRead(conversationId, userId); }
}
