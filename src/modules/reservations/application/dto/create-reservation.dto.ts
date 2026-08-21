import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID du trajet', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  trajet_id: string;

  @ApiProperty({ description: 'Nombre de places réservées', minimum: 1 })
  @IsNumber()
  @Min(1)
  nombre_places_reservees: number;

  @ApiPropertyOptional({ description: 'Point de montée' })
  @IsString()
  @IsOptional()
  point_montee?: string;

  @ApiPropertyOptional({ description: 'Point de descente' })
  @IsString()
  @IsOptional()
  point_descente?: string;
}
