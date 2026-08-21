import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateVehiculeDto {
  @ApiProperty({ example: 'Toyota', description: 'Marque du véhicule' })
  @IsString()
  @IsNotEmpty({ message: 'La marque est obligatoire' })
  @MaxLength(50)
  marque!: string;

  @ApiProperty({ example: 'Corolla', description: 'Modèle du véhicule' })
  @IsString()
  @IsNotEmpty({ message: 'Le modèle est obligatoire' })
  @MaxLength(50)
  modele!: string;

  @ApiProperty({ example: 'Blanc', description: 'Couleur du véhicule' })
  @IsString()
  @IsNotEmpty({ message: 'La couleur est obligatoire' })
  @MaxLength(30)
  couleur!: string;

  @ApiProperty({ example: 'TG-1234-AZ', description: 'Numéro d\'immatriculation unique' })
  @IsString()
  @IsNotEmpty({ message: 'L\'immatriculation est obligatoire' })
  @MinLength(4)
  @MaxLength(20)
  immatriculation!: string;

  @ApiProperty({ example: 5, description: 'Nombre de places passagers (1-8)' })
  @IsInt({ message: 'Le nombre de places doit être un entier' })
  @Min(1, { message: 'Le véhicule doit avoir au moins 1 place' })
  @Max(8, { message: 'Le nombre de places ne peut pas dépasser 8' })
  nombre_places!: number;

  @ApiProperty({ example: 2019, description: 'Année de fabrication (1990-présent)' })
  @IsInt({ message: 'L\'année doit être un entier' })
  @Min(1990, { message: 'L\'année doit être supérieure à 1990' })
  @Max(new Date().getFullYear() + 1, { message: 'L\'année ne peut pas être dans le futur' })
  annee!: number;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/docs/carte-grise.jpg' })
  @IsUrl({}, { message: 'L\'URL de la carte grise n\'est pas valide' })
  @IsOptional()
  carte_grise_url?: string;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/docs/assurance.jpg' })
  @IsUrl({}, { message: 'L\'URL de l\'assurance n\'est pas valide' })
  @IsOptional()
  assurance_url?: string;

  @ApiPropertyOptional({ example: '2027-12-31' })
  @IsDateString({}, { message: 'Format de date invalide (AAAA-MM-JJ)' })
  @IsOptional()
  date_expiration_assurance?: string;

  @ApiPropertyOptional({ example: ['https://cdn.trajetgo.tg/photos/v1.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true, message: 'Chaque photo doit être une URL valide' })
  @IsOptional()
  photos?: string[];
}
