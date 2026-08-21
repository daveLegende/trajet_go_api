import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';

export class VerifyVehiculeDto {
  @ApiProperty({
    enum: [VehiculeVerificationStatus.VERIFIE, VehiculeVerificationStatus.REJETE],
    example: VehiculeVerificationStatus.VERIFIE,
    description: 'Nouveau statut du véhicule (VERIFIE ou REJETE uniquement)',
  })
  @IsEnum([VehiculeVerificationStatus.VERIFIE, VehiculeVerificationStatus.REJETE], {
    message: 'Le statut doit être VERIFIE ou REJETE',
  })
  @IsNotEmpty()
  statut!: VehiculeVerificationStatus.VERIFIE | VehiculeVerificationStatus.REJETE;

  @ApiPropertyOptional({
    example: 'Documents non conformes',
    description: 'Motif du rejet (obligatoire si statut = REJETE)',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  motif?: string;
}
