import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Contenu du message',
    example: 'Bonjour, êtes-vous toujours disponible pour le trajet ?',
  })
  @IsNotEmpty()
  @IsString()
  contenu: string;

  @ApiProperty({
    description: 'ID de la conversation',
    example: 'uuid-conversation-1',
  })
  @IsNotEmpty()
  @IsUUID('4')
  conversationId: string;
}
