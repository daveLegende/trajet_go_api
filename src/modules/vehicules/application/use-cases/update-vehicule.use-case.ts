import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from '../../../users/domain/entities/user.entity';
import { VehiculeVerificationStatus } from '../../domain/entities/vehicule.entity';
import {
  VEHICULE_REPOSITORY,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';
import { VehiculeMapper } from '../../infrastructure/mappers/vehicule.mapper';
import { VehiculeResponseDto } from '../dto/vehicule-response.dto';
import { UpdateVehiculeDto } from '../dto/update-vehicule.dto';

@Injectable()
export class UpdateVehiculeUseCase {
  constructor(
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
  ) {}

  async execute(
    vehiculeId: string,
    requesterId: string,
    dto: UpdateVehiculeDto,
  ): Promise<VehiculeResponseDto> {
    const vehicule = await this.vehiculeRepository.findById(vehiculeId);
    if (!vehicule) {
      throw new NotFoundException(`Véhicule "${vehiculeId}" introuvable.`);
    }

    if (vehicule.proprietaire_id !== requesterId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres véhicules.');
    }

    // Si des documents ou photos sont modifiés, repasse en EN_ATTENTE
    const hasDocumentChange =
      dto.carte_grise_url !== undefined ||
      dto.assurance_url !== undefined ||
      dto.date_expiration_assurance !== undefined ||
      dto.photos !== undefined;

    const updateData: any = {
      ...dto,
      date_expiration_assurance: dto.date_expiration_assurance
        ? new Date(dto.date_expiration_assurance)
        : undefined,
    };

    if (hasDocumentChange) {
      updateData.statut_verification = VehiculeVerificationStatus.EN_ATTENTE;
    }

    const updated = await this.vehiculeRepository.update(vehiculeId, updateData);
    return VehiculeMapper.toResponseDto(updated);
  }
}
