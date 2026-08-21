import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import {
  VEHICULE_REPOSITORY,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';
import { VehiculeMapper } from '../../infrastructure/mappers/vehicule.mapper';
import { VehiculeResponseDto } from '../dto/vehicule-response.dto';
import { VerifyVehiculeDto } from '../dto/verify-vehicule.dto';

@Injectable()
export class VerifyVehiculeUseCase {
  constructor(
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
  ) {}

  async execute(vehiculeId: string, dto: VerifyVehiculeDto): Promise<VehiculeResponseDto> {
    const vehicule = await this.vehiculeRepository.findById(vehiculeId);
    if (!vehicule) {
      throw new NotFoundException(`Véhicule "${vehiculeId}" introuvable.`);
    }

    // Si rejet, le motif est obligatoire
    if (dto.statut === VehiculeVerificationStatus.REJETE && !dto.motif) {
      throw new BadRequestException(
        'Un motif est obligatoire lors du rejet d\'un véhicule.',
      );
    }

    const updated = await this.vehiculeRepository.update(vehiculeId, {
      statut_verification: dto.statut,
    });

    return VehiculeMapper.toResponseDto(updated);
  }
}
