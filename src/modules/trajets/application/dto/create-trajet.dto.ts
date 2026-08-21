import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TypeReservation } from '../../domain/entities/trajet.entity';

export class CreateTrajetDto {
  @ApiProperty({ example: 'Lomé' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville_depart!: string;

  @ApiProperty({ example: 'Kpalimé' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ville_arrivee!: string;

  @ApiProperty({ example: 6.125 })
  @IsNumber()
  @IsLatitude()
  latitude_depart!: number;

  @ApiProperty({ example: 1.2136 })
  @IsNumber()
  @IsLongitude()
  longitude_depart!: number;

  @ApiProperty({ example: 6.136 })
  @IsNumber()
  @IsLatitude()
  latitude_arrivee!: number;

  @ApiProperty({ example: 1.222 })
  @IsNumber()
  @IsLongitude()
  longitude_arrivee!: number;

  @ApiProperty({ example: '2026-08-20T08:00:00.000Z' })
  @IsDateString()
  date_depart!: string;

  @ApiProperty({ example: '08:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  heure_depart!: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  @Max(8)
  places_disponibles!: number;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  prix_par_place!: number;

  @ApiProperty({ enum: TypeReservation, example: TypeReservation.INSTANT })
  @IsEnum(TypeReservation)
  type_reservation!: TypeReservation;

  @ApiPropertyOptional({ example: 'Trajet régulier en semaine' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'hebdomadaire' })
  @IsString()
  @IsOptional()
  recurrence?: string;

  @ApiPropertyOptional({ example: { fumeur: false, musique: true } })
  @IsOptional()
  preferences?: Record<string, any>;
}
