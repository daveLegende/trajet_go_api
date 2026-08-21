import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrajetStatus, TypeReservation } from '../../domain/entities/trajet.entity';

export class TrajetResponseDto {
  @ApiProperty({ example: 'trajet-uuid' })
  id!: string;

  @ApiProperty({ example: 'user-uuid' })
  conducteur_id!: string;

  @ApiProperty({ example: 'vehicule-uuid' })
  vehicule_id!: string;

  @ApiProperty({ example: 'Lomé' })
  ville_depart!: string;

  @ApiProperty({ example: 'Kpalimé' })
  ville_arrivee!: string;

  @ApiProperty({ example: 6.125 })
  latitude_depart!: number;

  @ApiProperty({ example: 1.2136 })
  longitude_depart!: number;

  @ApiProperty({ example: 6.136 })
  latitude_arrivee!: number;

  @ApiProperty({ example: 1.222 })
  longitude_arrivee!: number;

  @ApiProperty({ example: '2026-08-20T08:00:00.000Z' })
  date_depart!: Date;

  @ApiProperty({ example: '08:30' })
  heure_depart!: string;

  @ApiProperty({ example: 3 })
  places_disponibles!: number;

  @ApiProperty({ example: 2500 })
  prix_par_place!: number;

  @ApiProperty({ enum: TypeReservation, example: TypeReservation.INSTANT })
  type_reservation!: TypeReservation;

  @ApiProperty({ enum: TrajetStatus, example: TrajetStatus.OUVERT })
  statut!: TrajetStatus;

  @ApiPropertyOptional({ example: 'hebdomadaire' })
  recurrence?: string | null;

  @ApiPropertyOptional({ example: { fumeur: false, musique: true } })
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Trajet régulier en semaine' })
  description?: string | null;

  @ApiProperty({ example: '2026-08-18T10:00:00.000Z' })
  date_creation!: Date;

  @ApiProperty({ example: '2026-08-18T10:00:00.000Z' })
  date_mise_a_jour!: Date;
}
