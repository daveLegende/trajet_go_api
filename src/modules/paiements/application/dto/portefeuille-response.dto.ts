import { ApiProperty } from '@nestjs/swagger';
import { PortefeuilleEntity } from '../../domain/entities/portefeuille.entity';

export class PortefeuilleResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  user_id: string;

  @ApiProperty({ example: 5000.00, description: 'Solde du portefeuille en FCFA' })
  solde: number;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  date_creation: string;

  @ApiProperty({ example: '2026-01-01T12:00:00.000Z' })
  date_mise_a_jour: string;

  static fromEntity(entity: PortefeuilleEntity): PortefeuilleResponseDto {
    const dto = new PortefeuilleResponseDto();
    dto.id = entity.id;
    dto.user_id = entity.user_id;
    dto.solde = entity.solde;
    dto.date_creation = entity.date_creation.toISOString();
    dto.date_mise_a_jour = entity.date_mise_a_jour.toISOString();
    return dto;
  }
}
