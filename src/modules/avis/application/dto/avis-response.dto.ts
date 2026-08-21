import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AvisEntity } from '../../domain/entities/avis.entity';

export class AvisResponseDto {
  @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440222' })
  id: string;

  @ApiProperty({ example: '880e8400-e29b-41d4-a716-446655440333' })
  auteur_id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  cible_id: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440111' })
  trajet_id: string;

  @ApiProperty({ example: 5 })
  note: number;

  @ApiPropertyOptional({ example: 'Très bon conducteur.' })
  commentaire: string | null;

  @ApiProperty({ example: '2026-08-19T10:00:00.000Z' })
  date_creation: string;

  static fromEntity(entity: AvisEntity): AvisResponseDto {
    const dto = new AvisResponseDto();
    dto.id = entity.id;
    dto.auteur_id = entity.auteur_id;
    dto.cible_id = entity.cible_id;
    dto.trajet_id = entity.trajet_id;
    dto.note = entity.note;
    dto.commentaire = entity.commentaire;
    dto.date_creation = entity.date_creation.toISOString();
    return dto;
  }
}
