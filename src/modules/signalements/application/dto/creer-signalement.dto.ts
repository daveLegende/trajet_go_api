import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MotifSignalement } from '../../domain/entities/signalement.entity';

export class CreerSignalementDto {
  @ApiProperty({ description: 'ID de l\'utilisateur signalé', example: 'uuid-cible' })
  @IsNotEmpty()
  @IsUUID()
  cibleId: string;

  @ApiProperty({ enum: MotifSignalement, description: 'Le motif du signalement' })
  @IsNotEmpty()
  @IsEnum(MotifSignalement)
  motif: MotifSignalement;

  @ApiPropertyOptional({ description: 'ID du trajet lié au signalement', example: 'uuid-trajet' })
  @IsOptional()
  @IsUUID()
  trajetId?: string;

  @ApiPropertyOptional({ description: 'Explications détaillées', example: 'Le conducteur avait un comportement...' })
  @IsOptional()
  @IsString()
  description?: string;
}
