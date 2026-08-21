import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateAvisDto {
  @ApiProperty({
    description: 'Identifiant de l\'utilisateur cible (celui qui est noté)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID('4')
  cible_id: string;

  @ApiProperty({
    description: 'Identifiant du trajet concerné',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @IsString()
  @IsUUID('4')
  trajet_id: string;

  @ApiProperty({
    description: 'Note attribuée (entre 1 et 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  note: number;

  @ApiPropertyOptional({
    description: 'Commentaire optionnel sur le trajet ou la personne',
    example: 'Très bon conducteur, ponctuel et agréable.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  commentaire?: string;
}
