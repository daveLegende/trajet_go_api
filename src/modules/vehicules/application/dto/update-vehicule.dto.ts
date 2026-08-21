import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateVehiculeDto {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  marque?: string;

  @ApiPropertyOptional({ example: 'Corolla' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  modele?: string;

  @ApiPropertyOptional({ example: 'Blanc' })
  @IsString()
  @MaxLength(30)
  @IsOptional()
  couleur?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(8)
  @IsOptional()
  nombre_places?: number;

  @ApiPropertyOptional({ example: 2019 })
  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  annee?: number;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/docs/carte-grise.jpg' })
  @IsUrl()
  @IsOptional()
  carte_grise_url?: string;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/docs/assurance.jpg' })
  @IsUrl()
  @IsOptional()
  assurance_url?: string;

  @ApiPropertyOptional({ example: '2027-12-31' })
  @IsDateString()
  @IsOptional()
  date_expiration_assurance?: string;

  @ApiPropertyOptional({ example: ['https://cdn.trajetgo.tg/photos/v1.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  photos?: string[];
}
