import { Controller, Post, Get, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CreateConversationUseCase } from '../../application/use-cases/create-conversation.use-case';
import { GetConversationsUseCase } from '../../application/use-cases/get-conversations.use-case';
import { GetMessagesUseCase } from '../../application/use-cases/get-messages.use-case';
import { MarkMessagesAsReadUseCase } from '../../application/use-cases/mark-messages-read.use-case';
import { CreateConversationDto } from '../../application/dto/create-conversation.dto';

@ApiTags('Messagerie')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class MessagerieController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly markMessagesAsReadUseCase: MarkMessagesAsReadUseCase,
  ) {}
  @Post() async createConversation(@Request() req, @Body() dto: CreateConversationDto) { return this.createConversationUseCase.execute(req.user.userId, dto); }
  @Get() async getConversations(@Request() req) { return this.getConversationsUseCase.execute(req.user.userId); }
  @Get(':id/messages') async getMessages(@Request() req, @Param('id') id: string) { return this.getMessagesUseCase.execute(req.user.userId, id); }
  @Patch(':id/read') async markAsRead(@Request() req, @Param('id') id: string) { await this.markMessagesAsReadUseCase.execute(req.user.userId, id); return { success: true }; }
}
