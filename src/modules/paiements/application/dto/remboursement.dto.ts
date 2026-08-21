import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class RemboursementDto {
  @ApiProperty({
    description: 'Identifiant de la transaction à rembourser',
    example: '770e8400-e29b-41d4-a716-446655440222',
  })
  @IsString()
  @IsUUID('4', { message: 'L\'identifiant de transaction doit être un UUID v4 valide' })
  transaction_id: string;

  @ApiPropertyOptional({
    description: 'Motif du remboursement (optionnel)',
    example: 'Annulation du trajet par le conducteur',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  motif?: string;
}
