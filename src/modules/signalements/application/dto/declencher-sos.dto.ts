import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeclencherSosDto {
  @ApiProperty({ description: 'ID du trajet en cours', example: 'uuid-trajet' })
  @IsNotEmpty()
  @IsUUID()
  trajetId: string;

  @ApiProperty({ description: 'Latitude actuelle', example: 48.8566 })
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude actuelle', example: 2.3522 })
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
