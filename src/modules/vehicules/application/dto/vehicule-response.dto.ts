import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';

export class VehiculeResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id!: string;

  @ApiProperty({ example: 'user-uuid-1' })
  proprietaire_id!: string;

  @ApiProperty({ example: 'Toyota' })
  marque!: string;

  @ApiProperty({ example: 'Corolla' })
  modele!: string;

  @ApiProperty({ example: 'Blanc' })
  couleur!: string;

  @ApiProperty({ example: 'TG-1234-AZ' })
  immatriculation!: string;

  @ApiProperty({ example: 5 })
  nombre_places!: number;

  @ApiProperty({ example: 2019 })
  annee!: number;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/docs/carte-grise.jpg' })
  carte_grise_url?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/docs/assurance.jpg' })
  assurance_url?: string | null;

  @ApiPropertyOptional({ example: '2027-12-31T00:00:00.000Z' })
  date_expiration_assurance?: string | null;

  @ApiProperty({ enum: VehiculeVerificationStatus, example: VehiculeVerificationStatus.EN_ATTENTE })
  statut_verification!: VehiculeVerificationStatus;

  @ApiProperty({ example: ['https://cdn.trajetgo.tg/photos/v1.jpg'] })
  photos!: string[];

  @ApiProperty({ example: '2026-08-18T12:00:00.000Z' })
  date_creation!: string;

  @ApiProperty({ example: '2026-08-18T12:00:00.000Z' })
  date_mise_a_jour!: string;
}
