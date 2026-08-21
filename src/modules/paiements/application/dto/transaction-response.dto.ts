import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionEntity, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440222' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  portefeuille_id: string;

  @ApiPropertyOptional({ example: '880e8400-e29b-41d4-a716-446655440333', nullable: true })
  reservation_id: string | null;

  @ApiProperty({ enum: TransactionType, example: TransactionType.CREDIT })
  type: TransactionType;

  @ApiProperty({ example: 5000.00 })
  montant: number;

  @ApiProperty({ enum: TransactionStatus, example: TransactionStatus.REUSSIE })
  statut: TransactionStatus;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440111' })
  cle_idempotence: string;

  @ApiPropertyOptional({ example: 'Recharge Mobile Money', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2026-01-01T10:00:00.000Z' })
  date_creation: string;

  @ApiProperty({ example: '2026-01-01T10:00:05.000Z' })
  date_mise_a_jour: string;

  static fromEntity(entity: TransactionEntity): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.id = entity.id;
    dto.portefeuille_id = entity.portefeuille_id;
    dto.reservation_id = entity.reservation_id;
    dto.type = entity.type;
    dto.montant = entity.montant;
    dto.statut = entity.statut;
    dto.cle_idempotence = entity.cle_idempotence;
    dto.description = entity.description;
    dto.date_creation = entity.date_creation.toISOString();
    dto.date_mise_a_jour = entity.date_mise_a_jour.toISOString();
    return dto;
  }
}
