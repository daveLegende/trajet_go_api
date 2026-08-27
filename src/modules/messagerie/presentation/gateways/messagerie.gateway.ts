import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../../../common/guards/ws-jwt.guard';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { CreateMessageDto } from '../../application/dto/create-message.dto';

@WebSocketGateway({ namespace: 'messagerie', cors: { origin: '*' } })
export class MessagerieGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}
  handleConnection(client: Socket) {}
  handleDisconnect(client: Socket) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinConversation')
  handleJoinConversation(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.join(data.conversationId);
    return { event: 'joined', data: data.conversationId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: CreateMessageDto) {
    const userId = (client as any).user.userId;
    const message = await this.sendMessageUseCase.execute(userId, dto);
    this.server.to(dto.conversationId).emit('newMessage', message);
    return message;
  }
}
