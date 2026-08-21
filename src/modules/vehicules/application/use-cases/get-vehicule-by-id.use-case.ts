import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from '../../../users/domain/entities/user.entity';
import {
  VEHICULE_REPOSITORY,
  VehiculeRepositoryInterface,
} from '../../domain/repositories/vehicule.repository.interface';
import { VehiculeMapper } from '../../infrastructure/mappers/vehicule.mapper';
import { VehiculeResponseDto } from '../dto/vehicule-response.dto';

@Injectable()
export class GetVehiculeByIdUseCase {
  constructor(
    @Inject(VEHICULE_REPOSITORY)
    private readonly vehiculeRepository: VehiculeRepositoryInterface,
  ) {}

  async execute(
    vehiculeId: string,
    requesterId: string,
    requesterRole: string,
  ): Promise<VehiculeResponseDto> {
    const vehicule = await this.vehiculeRepository.findById(vehiculeId);
    if (!vehicule) {
      throw new NotFoundException(`Véhicule "${vehiculeId}" introuvable.`);
    }

    const isAdmin = requesterRole === UserType.ADMIN;
    const isOwner = vehicule.proprietaire_id === requesterId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à consulter ce véhicule.');
    }

    return VehiculeMapper.toResponseDto(vehicule);
  }
}
