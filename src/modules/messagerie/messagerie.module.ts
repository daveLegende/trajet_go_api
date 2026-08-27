import { Module } from '@nestjs/common';
import { MessagerieController } from './presentation/controllers/messagerie.controller';
import { MessagerieGateway } from './presentation/gateways/messagerie.gateway';
import { CreateConversationUseCase } from './application/use-cases/create-conversation.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { GetConversationsUseCase } from './application/use-cases/get-conversations.use-case';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { MarkMessagesAsReadUseCase } from './application/use-cases/mark-messages-read.use-case';
import { PrismaConversationRepository } from './infrastructure/persistence/prisma-conversation.repository';
import { PrismaMessageRepository } from './infrastructure/persistence/prisma-message.repository';
import { CONVERSATION_REPOSITORY, MESSAGE_REPOSITORY } from './domain/repositories/messagerie.repository';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MessagerieController],
  providers: [
    { provide: CONVERSATION_REPOSITORY, useClass: PrismaConversationRepository },
    { provide: MESSAGE_REPOSITORY, useClass: PrismaMessageRepository },
    CreateConversationUseCase,
    SendMessageUseCase,
    GetConversationsUseCase,
    GetMessagesUseCase,
    MarkMessagesAsReadUseCase,
    MessagerieGateway,
  ],
})
export class MessagerieModule {}
