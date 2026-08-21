import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class PayerReservationDto {
  @ApiProperty({
    description: 'Identifiant de la réservation à payer',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID('4', { message: 'L\'identifiant de réservation doit être un UUID v4 valide' })
  reservation_id: string;

  @ApiProperty({
    description: 'Clé d\'idempotence unique (UUID) pour éviter les doubles débits',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @IsString()
  @IsUUID('4', { message: 'La clé d\'idempotence doit être un UUID v4 valide' })
  cle_idempotence: string;
}
