import { IsNotEmpty, IsString, IsOptional, IsArray, ArrayMinSize, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'IDs des utilisateurs participant à la conversation (sans compter celui qui crée, ou en l\'incluant)',
    example: ['uuid-user-1'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  participantIds: string[];

  @ApiPropertyOptional({
    description: 'ID du trajet associé (optionnel)',
    example: 'uuid-trajet-1',
  })
  @IsOptional()
  @IsUUID('4')
  trajetId?: string;
}
