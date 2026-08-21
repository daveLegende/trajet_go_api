import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreditPortefeuilleDto {
  @ApiProperty({
    description: 'Montant à créditer en FCFA (minimum 100)',
    example: 5000,
    minimum: 100,
  })
  @IsNumber()
  @Min(100, { message: 'Le montant minimum de recharge est de 100 FCFA' })
  montant: number;

  @ApiProperty({
    description: 'Clé d\'idempotence unique (UUID) pour éviter les doubles crédits',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID('4', { message: 'La clé d\'idempotence doit être un UUID v4 valide' })
  cle_idempotence: string;
}
