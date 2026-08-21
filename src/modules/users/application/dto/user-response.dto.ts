import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountStatus,
  UserType,
  VerificationStatus,
} from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id!: string;

  @ApiProperty({ example: 'Koffi' })
  nom!: string;

  @ApiProperty({ example: 'Abalo' })
  prenom!: string;

  @ApiProperty({ example: 'koffi.abalo@example.com' })
  email!: string;

  @ApiProperty({ example: '+22890123456' })
  telephone!: string;

  @ApiPropertyOptional({ example: '1995-05-15T00:00:00.000Z' })
  date_naissance?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/profiles/photo.jpg' })
  photo_profil_url?: string | null;

  @ApiProperty({ enum: UserType, example: UserType.PASSAGER })
  type_utilisateur!: UserType;

  @ApiProperty({ enum: VerificationStatus, example: VerificationStatus.NON_VERIFIE })
  statut_verification!: VerificationStatus;

  @ApiPropertyOptional({ example: 'https://cdn.trajetgo.tg/ids/id.jpg' })
  piece_identite_url?: string | null;

  @ApiProperty({ example: 4.85 })
  note_moyenne!: number;

  @ApiProperty({ example: 12 })
  nombre_trajets!: number;

  @ApiProperty({ example: 'fr' })
  langue_preferee!: string;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIF })
  statut_compte!: AccountStatus;

  @ApiProperty({ example: '2026-08-18T12:00:00.000Z' })
  date_creation!: string;

  @ApiPropertyOptional({ example: '2026-08-18T13:00:00.000Z' })
  date_derniere_connexion?: string | null;
}
